# Replit Agent Guide for NursingFront

This guide explains how to use **Replit Agent** (AI assistant) effectively with this codebase.

## ✅ Yes, Replit Agent Can Work With This Codebase!

Replit Agent can perform tasks across:
- ✅ **Prisma/Database** - Schema changes, migrations, queries
- ✅ **Backend** - API endpoints, controllers, services, middleware
- ✅ **Frontend** - React components, pages, routes, styling
- ✅ **Configuration** - Environment setup, build configs
- ✅ **Debugging** - Error fixing, testing, optimization

## 🎯 How Replit Agent Works

Replit Agent has two modes:

### 1. **Plan Mode** (Brainstorming)
- Ask questions about the codebase
- Get suggestions and recommendations
- Plan features without making changes
- Use: "How can I add user authentication?"

### 2. **Build Mode** (Implementation)
- Agent makes actual code changes
- Can modify multiple files
- Tests changes automatically
- Use: "Add a new job posting API endpoint"

## 📋 Project Structure for Agent

The agent understands this structure:

```
client/src/
├── main.jsx          # Entry point
├── App.jsx           # Main app component
├── Components/       # Reusable components
├── Pages/            # Page components
├── Routes/           # Route definitions
├── Services/         # API calls
└── Context/          # State management

server/src/
├── index.js          # Entry point
├── configs/          # Configuration files
├── controllers/      # Request handlers
├── routes/           # API routes
├── middlewares/      # Express middleware
└── prisma/
    └── schema.prisma # Database schema
```

## 💡 Example Tasks for Replit Agent

### Database/Prisma Tasks
```
"Add a new field 'isPremium' to the Users model in Prisma schema"
"Create a migration for adding a job categories table"
"Update the Jobs model to include salary range fields"
"Generate Prisma client after schema changes"
```

### Backend Tasks
```
"Create a new API endpoint GET /api/v1/jobs/search that filters jobs by location"
"Add validation for job posting form in the backend"
"Create a middleware to check if user is authenticated"
"Add rate limiting to the job creation endpoint"
```

### Frontend Tasks
```
"Create a new JobSearch component with filters"
"Add a user profile page that displays user information"
"Update the navigation to include a new 'About' link"
"Create a loading spinner component"
"Add form validation to the job application form"
```

### Full-Stack Tasks
```
"Add a feature to save jobs for later - need both frontend UI and backend API"
"Implement job application functionality with email notifications"
"Create an admin dashboard to manage job postings"
```

## 🎨 Best Practices for Agent Prompts

### ✅ Good Prompts
- **Specific:** "Add a 'companyLogo' field to the Companies model"
- **Context-aware:** "In the JobCard component, add a favorite button"
- **Complete:** "Create a new API endpoint POST /api/v1/jobs/:id/apply that saves job applications"

### ❌ Avoid Vague Prompts
- "Fix the bug" (be specific about which bug)
- "Make it better" (specify what to improve)
- "Add features" (list specific features)

## 🔍 How Agent Understands Your Codebase

The agent can:
1. **Read files** - Understands your code structure
2. **Follow patterns** - Matches your existing code style
3. **Navigate dependencies** - Knows how files connect
4. **Respect conventions** - Follows your naming and structure

### Key Files Agent References
- `package.json` files - Understands dependencies
- `schema.prisma` - Knows database structure
- Route files - Understands API structure
- Component structure - Matches React patterns

## 🛠️ Common Agent Workflows

### Adding a New Feature

**Step 1: Plan**
```
"Plan: I want to add a feature where users can follow companies. 
What changes are needed in the database, backend, and frontend?"
```

**Step 2: Implement**
```
"Implement: Add the follow company feature. 
- Add a Follows table in Prisma
- Create API endpoints to follow/unfollow
- Add follow button in company profile page"
```

### Fixing Bugs

```
"The job search is not working. The API returns 500 error. 
Please check the server logs and fix the issue."
```

### Refactoring

```
"Refactor the job filtering logic in the JobsController 
to be more modular and add unit tests."
```

## 📝 Agent-Friendly Code Patterns

Your codebase already follows good patterns:

✅ **Clear file structure** - Easy to navigate  
✅ **Consistent naming** - Components, controllers follow conventions  
✅ **Modular design** - Separated concerns (controllers, services, routes)  
✅ **Documentation** - Comments and structure help agent understand  

## 🚨 Important Notes for Agent

### Database Changes
- Always run migrations after Prisma schema changes
- Agent should suggest: `npm run prisma:migrate`
- Check for breaking changes in existing data

### Environment Variables
- Agent cannot access `.env` files (security)
- Remind agent to update `sample.env` if adding new variables
- Document required variables in prompts

### Testing
- Agent can run tests automatically
- Check console output for errors
- Verify changes in Replit Preview

## 🎯 Example: Complete Feature Request

**Prompt to Agent:**
```
"I need to add a job application feature:

1. Database: Add an Applications table with fields:
   - id, userId, jobId, status, coverLetter, createdAt

2. Backend: Create endpoints:
   - POST /api/v1/applications - Submit application
   - GET /api/v1/applications/user/:userId - Get user's applications
   - GET /api/v1/applications/job/:jobId - Get job's applications

3. Frontend: 
   - Add 'Apply' button to job detail page
   - Create application form modal
   - Show user's applications in profile

Please implement this feature following the existing code patterns."
```

## 🔄 Agent Limitations

Agent may struggle with:
- **Complex business logic** - May need clarification
- **External API integrations** - Needs API keys/docs
- **Performance optimization** - May need specific requirements
- **Security concerns** - Always review security-related changes

## ✅ Verification Checklist

After agent makes changes:
- [ ] Check console for errors
- [ ] Test in Replit Preview
- [ ] Verify database migrations (if schema changed)
- [ ] Check environment variables are documented
- [ ] Review code follows project patterns
- [ ] Test API endpoints (if backend changed)

## 🎓 Tips for Best Results

1. **Be specific** - Clear requirements = better results
2. **Provide context** - Mention related files/features
3. **Review changes** - Always check agent's work
4. **Iterate** - Refine prompts based on results
5. **Use Plan mode first** - Understand before implementing

## 📚 Additional Resources

- **Replit Agent Docs:** [docs.replit.com/agent](https://docs.replit.com/agent)
- **Project Docs:** See `replit.md` and `REPLIT_QUICK_START.md`
- **Code Structure:** See `README.md`

---

**Ready to use Replit Agent?** Start with Plan mode to explore, then switch to Build mode to implement!
