const puppeteer = require("puppeteer");
const fs = require("fs");
const Papa = require("papaparse");
const generateSlug = require("../pipes/generateSlug.pipe");
const prisma = require("../configs/database.config");

const VIVIAN_URL =
  "https://www.vivian.com/browse-jobs/?menu%5BdisciplineName%5D=RN&refinementList%5BemploymentType%5D=Permanent&saveSearchAsRecent=true&page=1&configure%5BhitsPerPage%5D=25&configure%5BfacetingAfterDistinct%5D=true&configure%5BfacetFilters%5D%5B0%5D%5B0%5D=employmentType%3APermanent&configure%5BfacetFilters%5D%5B1%5D%5B0%5D=disciplineName%3ARN&configure%5Bfilters%5D=%28origin%3A%22platform%22%20OR%20origin%3A%22vms%22%29&configure%5BclickAnalytics%5D=true&configure%5BmaxValuesPerFacet%5D=1000";
const AMN_URL =
  "https://www.amnhealthcare.com/jobs/c/Nursing/?sortOrder=newest&filters=Discipline:Registered%20Nurse";

function parseSalary(salary) {
  if (!salary)
    return { interval: "", min: "", max: "", currency: "", source: "" };
  const match = salary.match(/\$([\d.,]+)-(\d+[\d.,]*)\/(\w+)/);
  if (match) {
    return {
      interval: match[3],
      min: parseFloat(match[1].replace(/,/g, "")),
      max: parseFloat(match[2].replace(/,/g, "")),
      currency: "USD",
      source: "direct_data",
    };
  }
  return { interval: "", min: "", max: "", currency: "", source: "" };
}

async function crawlVivian() {
  const jobs = [];
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(VIVIAN_URL, { waitUntil: "networkidle2" });
    await page.waitForSelector('a[href^="/job/"]', { timeout: 15000 });
    const jobLinks = await page.$$eval('a[href^="/job/"]', (links) =>
      Array.from(new Set(links.map((link) => link.getAttribute("href"))))
    );
    for (const link of jobLinks) {
      try {
        const detailPage = await browser.newPage();
        await detailPage.goto("https://www.vivian.com" + link, {
          waitUntil: "networkidle2",
        });
        const jobData = await detailPage.$$eval(
          'script[type="application/ld+json"]',
          (scripts) => {
            for (const script of scripts) {
              try {
                const json = JSON.parse(script.innerText);
                if (json["@type"] === "JobPosting") return json;
              } catch (e) {}
            }
            return null;
          }
        );
        if (jobData) {
          jobs.push({
            title: jobData.title || "",
            company: jobData.hiringOrganization?.name || "",
            location: jobData.jobLocation?.address?.addressLocality || "",
            salary:
              jobData.baseSalary?.value?.minValue &&
              jobData.baseSalary?.value?.maxValue
                ? `$${jobData.baseSalary.value.minValue}-${jobData.baseSalary.value.maxValue}/${jobData.baseSalary.value.unitText.toLowerCase()}`
                : "",
            description: jobData.description || "",
            url: "https://www.vivian.com" + link,
            site: "Vivian",
          });
        }
        await detailPage.close();
      } catch (e) {}
    }
  } catch (err) {
    console.error("Error crawling Vivian:", err.message);
  } finally {
    if (browser) await browser.close();
  }
  return jobs;
}

async function crawlAmn() {
  const jobs = [];
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(AMN_URL, { waitUntil: "networkidle2" });
    await page.waitForSelector('a[href^="/job-details/"]', { timeout: 15000 });
    const jobLinks = await page.$$eval('a[href^="/job-details/"]', (links) =>
      Array.from(new Set(links.map((link) => link.getAttribute("href"))))
    );
    for (const link of jobLinks) {
      try {
        const detailPage = await browser.newPage();
        await detailPage.goto("https://www.amnhealthcare.com" + link, {
          waitUntil: "networkidle2",
        });
        let jobData = await detailPage.$$eval(
          'script[type="application/ld+json"]',
          (scripts) => {
            for (const script of scripts) {
              try {
                const json = JSON.parse(script.innerText);
                if (json["@type"] === "JobPosting") return json;
              } catch (e) {}
            }
            return null;
          }
        );

        if (!jobData) {
          jobData = await detailPage
            .$eval(
              'div[data-react-component="CommunityJobDetails"][data-props]',
              (div) => {
                try {
                  const props = JSON.parse(div.getAttribute("data-props"));
                  return props.jobDetails || null;
                } catch (e) {
                  return null;
                }
              }
            )
            .catch(() => null);
        }
        if (jobData) {
          let title = jobData.title || jobData.jobTitle || "";
          let company =
            jobData.hiringOrganization?.name ||
            jobData.divisionCompany?.companyName ||
            "";
          let location =
            jobData.jobLocation?.address?.addressLocality ||
            (jobData.city?.name ? jobData.city.name + ", " : "") +
              (jobData.state?.abbrev || "");
          let salary = "";
          if (
            jobData.baseSalary?.value?.minValue &&
            jobData.baseSalary?.value?.maxValue
          ) {
            salary = `$${jobData.baseSalary.value.minValue}-${jobData.baseSalary.value.maxValue}/${jobData.baseSalary.value.unitText?.toLowerCase() || ""}`;
          } else if (
            jobData.payRate?.minPayRate &&
            jobData.payRate?.maxPayRate
          ) {
            salary = `$${jobData.payRate.minPayRate}-${jobData.payRate.maxPayRate}/${jobData.payRate.payRateTypeAbbrev || ""}`;
          }

          // --- Build HTML description with sections if present ---
          let descParts = [];
          // Try to get from JSON/data-props first
          let jobDetails = jobData.jobDetails || jobData.description || jobData.descriptionLong || "";
          let requirements = jobData.requiredQualifications || "";
          let benefits = jobData.jobBenefits || "";

          // If any are missing, try to extract from visible HTML
          if (!(jobDetails && jobDetails.trim()) || !(requirements && requirements.trim()) || !(benefits && benefits.trim())) {
            const htmlSections = await detailPage.evaluate(() => {
              function getSectionText(headingTexts) {
                const headings = Array.from(document.querySelectorAll('h2, h3'));
                for (const heading of headings) {
                  if (headingTexts.includes(heading.textContent.trim())) {
                    // Get all sibling elements until next heading
                    let content = '';
                    let el = heading.nextElementSibling;
                    while (el && !['H2','H3'].includes(el.tagName)) {
                      content += el.outerHTML || el.textContent || '';
                      el = el.nextElementSibling;
                    }
                    return content.trim();
                  }
                }
                return '';
              }
              return {
                jobDetails: getSectionText(['Job Details','Job Detail','Job Overview','Overview']),
                requirements: getSectionText(['Requirements','Requirement','Qualifications']),
                benefits: getSectionText(['Benefits','Benefit'])
              };
            });
            if (!jobDetails || !jobDetails.trim()) jobDetails = htmlSections.jobDetails;
            if (!requirements || !requirements.trim()) requirements = htmlSections.requirements;
            if (!benefits || !benefits.trim()) benefits = htmlSections.benefits;
          }

          if (jobDetails && jobDetails.trim()) {
            descParts.push(`<h3>Job Details</h3><div style=\"padding-bottom:1.25rem\">${jobDetails}</div>`);
          }
          if (requirements && requirements.trim()) {
            descParts.push(`<h3>Requirements</h3><div style=\"padding-bottom:1.25rem\">${requirements}</div>`);
          }
          if (benefits && benefits.trim()) {
            descParts.push(`<h3>Benefits</h3><div>${benefits}</div>`);
          }
          let description = `<div>${descParts.join("\n")}</div>`;

          jobs.push({
            title,
            company,
            location,
            salary,
            description,
            url: "https://www.amnhealthcare.com" + link,
            site: "AMN Healthcare",
          });
        }
        await detailPage.close();
      } catch (e) {}
    }
  } catch (err) {
    console.error("Error crawling AMN Healthcare:", err.message);
  } finally {
    if (browser) await browser.close();
  }
  return jobs;
}

function toJobsCsvFormat(jobs) {
  // Only include fields needed for CrawledJobs
  return jobs.map((row) => {
    const salary = parseSalary(row.salary);
    return {
      title: row.title || "",
      company: row.company || "",
      location: row.location || "",
      job_type: row.job_type || "",
      interval: salary.interval,
      min_amount: salary.min,
      max_amount: salary.max,
      is_remote: row.is_remote || "",
      description: row.description || "",
      company_logo: row.company_logo || "",
      job_url: row.url || "",
      job_url_direct: row.url || "",
      site: row.site || "",
    };
  });
}

exports.externalCrawler = async () => {
  console.log("🤖 Starting combined job crawling and conversion process...\n");
  let allJobs = [];
  try {
    console.log("📊 Crawling jobs from Vivian...");
    const vivianJobs = await crawlVivian();
    console.log(`✅ Found ${vivianJobs.length} jobs from Vivian.`);
    console.log("📊 Crawling jobs from AMN Healthcare...");
    const amnJobs = await crawlAmn();
    console.log(`✅ Found ${amnJobs.length} jobs from AMN Healthcare.`);
    allJobs = [...vivianJobs, ...amnJobs];
    if (allJobs.length === 0) {
      console.log("No jobs found.");
      return;
    }
    // Convert to jobs.csv format
    const jobsCsv = toJobsCsvFormat(allJobs);
    const csv = Papa.unparse(jobsCsv);
    fs.writeFileSync("crawled_jobs.csv", csv);
    console.log(
      `\n✅ Successfully exported ${jobsCsv.length} jobs to crawled_jobs.csv in jobs.csv format.`
    );

    // Insert jobs into the database
    for (const [index, job] of jobsCsv.entries()) {
      try {
        const slug = generateSlug(`${job.title}-in-${job.company}`);
        // --- ENUM MAPPING ---
        // EmployementType mapping
        let employementType = "FULL_TIME";
        if (job.job_type) {
          const jt = job.job_type.toLowerCase();
          if (jt.includes("part")) employementType = "PART_TIME";
          else if (jt.includes("intern")) employementType = "INTERNSHIP";
          else if (jt.includes("contract")) employementType = "CONTRACT";
          else if (jt.includes("freelance")) employementType = "FREELANCEING";
          else if (jt.includes("per diem")) employementType = "PER_DIEM";
        }
        // SalaryType mapping
        let salaryType = "SALARY";
        if (job.interval) {
          const interval = job.interval.toLowerCase();
          if (["hourly", "hour"].includes(interval)) salaryType = "HOURLY";
          else if (interval === "daily") salaryType = "DAILY";
          else if (interval === "weekly") salaryType = "WEEKLY";
          else if (interval === "monthly") salaryType = "MONTHLY";
          else if (interval === "yearly" || interval === "year")
            salaryType = "YEARLY";
        }
        // JobType mapping
        let jobType = "ONSITE";
        if (job.is_remote && typeof job.is_remote === "string") {
          if (job.is_remote.toLowerCase() === "true") jobType = "REMOTE";
        }
        // companyImage as JSON
        let companyImage = null;
        if (job.company_logo) {
          if (typeof job.company_logo === "string") {
            companyImage = { url: job.company_logo };
          } else {
            companyImage = job.company_logo;
          }
        }

        await prisma.crawledJobs.create({
          data: {
            companyName: job.company,
            companyLocation: job.location,
            companyImage,
            title: job.title,
            location: job.location,
            overview: job.description,
            employementType,
            salaryType,
            minSalary:
              typeof job.min_amount === "number"
                ? job.min_amount
                : +job.min_amount || 0.0,
            maxSalary:
              typeof job.max_amount === "number"
                ? job.max_amount
                : +job.max_amount || 0.0,
            jobType,
            website: job.job_url_direct || job.job_url,
            slug: slug,
            provider: job.site,
            isPostedOnReddit: false,
            isPostedOnFacebook: false,
            active: true,
          },
        });
        console.log(`Job Posted: ${index + 1}`);
      } catch (err) {
        console.error(`Error posting job at index ${index + 1}:`, err.message);
      }
    }

    // Delete the CSV file after operation
    if (fs.existsSync("crawled_jobs.csv")) {
      fs.unlinkSync("crawled_jobs.csv");
      console.log("Temporary CSV file deleted.");
    }
  } catch (error) {
    console.error("\n❌ Error during crawling or conversion:", error.message);
    process.exit(1);
  }
  console.log("\n🎉 Combined crawling and conversion process completed!");
};
