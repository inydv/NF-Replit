import { useRef, useState, useContext, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import LinkTool from "@editorjs/link";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import { useNavigate } from "react-router-dom";
import RoutesConstant from "../Constants/Routes.Constant.json";
import BlogsService from "../Services/Blogs.Service";
import { ImagePlus, X, FileImage } from "lucide-react";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import { generatePageTitle } from "../Utils/SEOHelpers.Util";

const BLOG_INITIAL_DATA = {
  title: "",
  image: null,
  description: "",
  content: "",
  author: "",
};

const MAX_IMAGE_SIZE_MB = 25;

export default function AddBlogs() {
  const [input, setInput] = useState({ ...BLOG_INITIAL_DATA });
  const [previewImg, setPreviewImg] = useState(null);

  const [isError, setIsError] = useState(false);

  const imageInput = useRef(null);
  const editorInstance = useRef(null);
  const navigate = useNavigate();

  const handleInput = ({ name, value }) => {
    setInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateAndUploadImage = async (e) => {
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
        setPreviewImg(data.secure_url); // Use URL for preview
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

  useEffect(() => {
    document.title = generatePageTitle("Add New Blog Post");

    editorInstance.current = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
            inlineToolbar: ["bold", "italic", "link"],
          },
        },
        list: { class: List, inlineToolbar: true },
        quote: Quote,
        embed: {
          class: Embed,
          config: { services: { youtube: true, coub: true } },
        },
        paragraph: { class: Paragraph, inlineToolbar: true },
        linkTool: {
          class: LinkTool,
          config: { endpoint: "http://localhost:8008/fetchUrl" },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                try {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append(
                    "upload_preset",
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                  ); // Replace with your Cloudinary preset
                  formData.append(
                    "api_key",
                    import.meta.env.VITE_CLOUDINARY_API_KEY
                  ); // Optional: Use serverless function for security
                  formData.append("timestamp", Date.now() / 1000);

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
                    return {
                      success: 1,
                      file: {
                        url: data.secure_url,
                        name: data.original_filename,
                      },
                    };
                  } else {
                    throw new Error("Failed to upload image");
                  }
                } catch (error) {
                  console.error("Image upload error:", error);
                  return {
                    success: 0,
                    message: error.message,
                  };
                }
              },
              uploadByUrl: async (url) => {
                try {
                  return {
                    success: 1,
                    file: {
                      url,
                    },
                  };
                } catch (error) {
                  console.error("Image upload by URL error:", error);
                  return {
                    success: 0,
                    message: error.message,
                  };
                }
              },
            },
          },
        },
      },
      onReady: () => console.log("Editor.js is ready"),

      onChange: async () => {
        let content = await editorInstance.current.save();

        // Process ordered lists to ensure continuous numbering
        if (content.blocks && content.blocks.length > 0) {
          let listCounter = 1;
          let lastListIndex = -1;

          // First pass: add metadata to ordered lists
          content.blocks = content.blocks.map((block, index) => {
            if (block.type === "list" && block.data.style === "ordered") {
              // Track the index of the last ordered list we found
              lastListIndex = index;

              // Add custom metadata to this list block
              block.data.startAt = listCounter;

              // Increment our counter for the next list block
              listCounter += block.data.items.length;
            }
            return block;
          });
        }

        handleInput({ name: "content", value: content });
      },
    });

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, []);

  const validateForm = () => {
    if (!input.image) return "Please add an image.";
    if (!input.title) return "Please add a title.";
    if (!input.author) return "Please add an author name.";
    if (!input.description) return "Please add a short description.";
    if (!input.content || !input.content.blocks.length)
      return "Please add content.";
    return null;
  };

  const handleCreate = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert.error(errorMessage);
      return;
    }

    const formData = { ...input, content: JSON.stringify(input.content) };
    const { data } = await BlogsService.POST_BLOG({ reqBody: formData });

    if (data?.SUCCESS) {
      navigate(RoutesConstant.BLOGS);
    } else {
      alert.error("Failed to create the blog. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
          <p className="mt-2 text-gray-600">
            Share your knowledge and insights with the nursing community
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow-sm rounded-b-xl px-8 py-6">
          {/* Featured Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Featured Image
            </label>
            {previewImg ? (
              <div className="relative">
                <img
                  src={previewImg}
                  alt="Preview"
                  className="w-full aspect-[16/9] object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setPreviewImg(null);
                    handleInput({ name: "image", value: null });
                  }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => imageInput.current.click()}
                className="aspect-[16/9] w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50 flex flex-col justify-center items-center cursor-pointer group"
              >
                <FileImage className="w-12 h-12 text-gray-400 group-hover:text-gray-500 mb-3" />
                <span className="text-gray-600 group-hover:text-gray-700">
                  Click to upload featured image
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Maximum size: {MAX_IMAGE_SIZE_MB}MB
                </span>
              </div>
            )}
            <input
              ref={imageInput}
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={validateAndUploadImage}
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={input.title}
              onChange={(e) =>
                handleInput({ name: "title", value: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter an engaging title for your blog post"
            />
          </div>

          {/* Author */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={input.author}
              onChange={(e) =>
                handleInput({ name: "author", value: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your name as you'd like it to appear"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={input.description}
              onChange={(e) =>
                handleInput({ name: "description", value: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Write a brief description that will appear in blog previews"
            />
          </div>

          {/* Editor */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <div
              id="editorjs"
              className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Publish Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}