import { useContext, useRef, useState } from "react";
import { Url } from "../../Global";
import { toast } from "sonner";
import { AuthContext } from "../../app/layout";

export default function SignUp({ handleClose }) {
  const maxSizeBytes = 500 * 1024;
  const [selectedFile, setSelectedFile] = useState(null);
  const fileLabelRef = useRef(null);
  const { setIsFetching } = useContext(AuthContext);

  function handleFileChange(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
    const fileName = file ? file.name : "Choose Image";
    if (fileLabelRef.current) {
      fileLabelRef.current.textContent = fileName;
    }
  }

  function isFileTooLarge(file, maxSizeBytes) {
    return file.size > maxSizeBytes;
  }

  async function SaveUserData(event) {
    event.preventDefault();
    // Execute if image is chosen
    if (event.target.image.files.length > 0) {
      if (!isFileTooLarge(event.target.image.files[0], maxSizeBytes)) {
        // Get the file input element
        const fileInput = event.target.image.files[0];
        // Read the file as a Data URL
        const reader = new FileReader();
        reader.readAsDataURL(fileInput);
        // Once the file is loaded
        reader.onload = async function () {
          // Get the base64-encoded image data
          const imageData = reader.result;

          // Construct the userData object with the base64 image data
          var userData = {
            name: event.target.User_Name.value,
            email: event.target.email.value,
            password: event.target.pass.value,
            userPic: imageData, // Base64-encoded image data
          };

          try {
            setIsFetching(true);
            const response = await fetch(`${Url}/signup`, {
              method: "POST",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json",
              },
            });
            setIsFetching(false);
            handleClose();
            // Handle the server response
            const data = await response.json();
            toast.success(data.message);
            handleClose();
          } catch {
            toast.error("Error: server has issues");
          }
        };
      } else {
        toast.error("Picture Is Too Large");
      }
    }
    // Execute if image is not chosen
    else {
      var userData = {
        name: event.target.User_Name.value,
        email: event.target.email.value,
        password: event.target.pass.value,
        userPic: "NULL",
      };

      try {
        setIsFetching(true);
        const response = await fetch(`${Url}/signup`, {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        setIsFetching(false);
        handleClose();
        // Handle the server response
        const data = await response.json();
        toast.success(data.message);
      } catch {
        toast.error("Error: server has issues");
      }
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-white dark:text-gray-900">
            Sign UP
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={SaveUserData}>
            <div>
              <label
                htmlFor="User_Name"
                className="block text-sm font-medium leading-6 text-white dark:text-gray-900"
              >
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="User_Name"
                  name="User_Name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white dark:text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white dark:text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="pass"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="image"
                className="relative inline-block cursor-pointer overflow-hidden rounded-md border border-gray-300 bg-gray-200 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-300"
              >
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span
                  ref={fileLabelRef}
                  className="block px-4 py-2 text-center text-gray-600"
                >
                  {selectedFile ? selectedFile.name : "Choose Image"}
                </span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
