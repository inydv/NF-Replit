/* eslint-disable react/prop-types */
import { Children, useState } from "react";
import {
  createButton,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnNumberedList,
  Editor,
  EditorProvider,
  Toolbar,
  Separator,
  BtnBulletList,
  BtnLink,
  BtnStyles,
  BtnUndo,
  BtnRedo,
  BtnStrikeThrough,
  BtnClearFormatting,
} from "react-simple-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { LazyLoadImage } from "react-lazy-load-image-component";
import EnumConstant from "../Constants/Enum.Constant.json";

const BtnAlignCenter = createButton("Align center", "≡", "justifyCenter");

const MAX_IMAGE_SIZE_MB = 25;

export default function Form({
  formConstant,
  selection,
  inputs,
  setInputs,
  previewLogo,
  setPreviewLogo,
  changeCompany = null,
}) {
  const handleInput = ({ name, value }) => {
    setInputs((prevState) => ({
      ...prevState,
      [name]:
        name === "minSalary" || name === "maxSalary"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleMultipleSelect = (name, value) => {
    setInputs((prevState) => {
      const currentValues = prevState[name] || [];
      return {
        ...prevState,
        [name]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB

    if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
      alert.error(
        "Uh oh! The image you are trying to upload is too big. Please resize it so that it is under 25MB."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("timestamp", Date.now() / 1000);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setPreviewLogo(data.secure_url); // Use URL for preview
        handleInput({
          name: e.target.name,
          value: { public_id: data.public_id, url: data.secure_url },
        }); // Store the URL
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      alert.error("Image upload failed. Please try again.");
    }
  };

  return (
    <EditorProvider>
      <div className="space-y-6">
        {Children.toArray(
          formConstant.map((field) => {
            const {
              AUTOFOCUS,
              CLASSNAME,
              CONTAINER_CLASS,
              LABEL,
              NAME,
              INPUT_TYPE,
              TYPE,
              LABEL_CLASS,
              NAME2,
              REQUIRED,
              SELECTION_NAME,
              MULTIPLE_SELECT = false,
              suggestion,
            } = field;

            return (
              <div className={`${CONTAINER_CLASS} w-full`}>
                <label
                  className={`${LABEL_CLASS} block font-medium text-gray-700`}
                >
                  {LABEL} {REQUIRED && <span className="text-red-500">*</span>}
                </label>

                {/* WYSIWYG Editor */}
                {INPUT_TYPE === EnumConstant.FORM.EDITOR ? (
                  <div className="border min-h-[550px] rounded-md">
                    <Editor
                      className="min-h-[550px]"
                      // toolbarClassName="bg-gray-100 border-b px-3 py-2 rounded-t-lg"
                      // wrapperClassName="min-h-[600px] border rounded-lg bg-white"
                      // editorClassName="px-4 py-2 min-h-[550px] text-gray-800 focus:outline-none"
                      value={inputs[NAME] || ""}
                      onChange={(e) =>
                        handleInput({ name: NAME, value: e.target.value })
                      }
                    >
                      <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnStyles />
                        <BtnClearFormatting />
                      </Toolbar>
                    </Editor>
                  </div>
                ) : INPUT_TYPE === EnumConstant.FORM.SELECT ? (
                  MULTIPLE_SELECT ? (
                    <div className="pl-5">
                      {Children.toArray(
                        selection?.[SELECTION_NAME]?.map((item) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={item.NAME}
                              checked={inputs[NAME]?.includes(item.VALUE)}
                              onChange={() =>
                                handleMultipleSelect(NAME, item.VALUE)
                              }
                              className="accent-brand-500"
                            />
                            <label
                              htmlFor={item.NAME}
                              className="text-gray-700"
                            >
                              {item.NAME}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <select
                      name={NAME}
                      className={`${CLASSNAME} bg-white`}
                      value={inputs[NAME] || ""}
                      onChange={(e) =>
                        handleInput({ name: NAME, value: e.target.value })
                      }
                      required={REQUIRED}
                    >
                      <option hidden>Select</option>
                      {Children.toArray(
                        selection?.[SELECTION_NAME]?.map(({ NAME, VALUE }) => (
                          <option key={VALUE} value={VALUE}>
                            {NAME}
                          </option>
                        ))
                      )}
                    </select>
                  )
                ) : INPUT_TYPE === EnumConstant.FORM.FILE ? (
                  <div className="flex flex-col items-center gap-3">
                    <label
                      htmlFor="uploadButton"
                      className={`${CLASSNAME} cursor-pointer`}
                    >
                      {NAME2}
                      <input
                        type="file"
                        id="uploadButton"
                        name={NAME}
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                        required={REQUIRED}
                      />
                    </label>
                    {(previewLogo ||
                      inputs?.image?.url ||
                      inputs?.companyImage?.url) && (
                      <LazyLoadImage
                        src={
                          previewLogo ||
                          inputs?.image?.url ||
                          inputs?.companyImage?.url
                        }
                        className="max-h-24 max-w-[128px] aspect-video h-fit w-full object-contain"
                        alt="Preview"
                      />
                    )}
                  </div>
                ) : INPUT_TYPE === EnumConstant.FORM.TEXTAREA ? (
                  <textarea
                    rows={4}
                    className={`${CLASSNAME} resize-none`}
                    autoFocus={AUTOFOCUS}
                    required={REQUIRED}
                    name={NAME}
                    value={inputs[NAME] || ""}
                    onChange={(e) =>
                      handleInput({ name: NAME, value: e.target.value })
                    }
                  />
                ) : INPUT_TYPE === EnumConstant.FORM.INLINE_INPUT ? (
                  <div className="flex items-center gap-2">
                    <input
                      type={TYPE}
                      name={NAME}
                      className={CLASSNAME}
                      id={NAME}
                      checked={!!inputs[NAME]}
                      onChange={(e) =>
                        handleInput({ name: NAME, value: e.target.checked })
                      }
                    />
                    <label htmlFor={NAME} className={LABEL_CLASS}></label>
                  </div>
                ) : INPUT_TYPE === EnumConstant.FORM.SELECT_COMPANY &&
                  selection?.["COMPANY"]?.length > 0 ? (
                  <>
                    <select
                      name="company_id"
                      className={`${CLASSNAME} bg-white`}
                      value={inputs["company_id"] || ""}
                      onChange={(e) => {
                        handleInput({
                          name: "company_id",
                          value: e.target.value,
                        });
                        changeCompany(e.target.value);
                      }}
                      required
                    >
                      <option hidden>Select Company</option>
                      {Children.toArray(
                        selection["COMPANY"].map(({ id, company_name }) => (
                          <option key={id} value={id}>
                            {company_name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="flex items-center gap-5 mt-8">
                      <div className="h-0.5 bg-gray-200 w-full"></div>
                      <span className="text-base">OR</span>
                      <div className="h-0.5 bg-gray-200 w-full"></div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">{suggestion}</p>
                    <input
                      type={TYPE}
                      className={`${CLASSNAME} bg-white`}
                      autoFocus={AUTOFOCUS}
                      required={REQUIRED}
                      name={NAME}
                      value={inputs[NAME] || ""}
                      onChange={(e) =>
                        handleInput({ name: NAME, value: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </EditorProvider>
  );
}
