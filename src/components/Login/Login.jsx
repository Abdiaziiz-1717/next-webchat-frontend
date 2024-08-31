import { ActiveUser, Url } from "../../Global";
import { useContext } from "react";
import { AuthContext } from "../../app/layout";
import { toast } from "sonner";

export default function Login({ handleClose }) {
  const { setIsLogged, setIsFetching } = useContext(AuthContext);

  async function OnLogin(event) {
    event.preventDefault();

    // Construct the userData object with the base64 image data
    var userData = {
      email: event.target.email.value,
      password: event.target.pass.value,
    };

    try {
      setIsFetching(true);
      const response = await fetch(`${Url}/login`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsFetching(false);

      // Handle the server response
      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.message) {
        toast.error(data.message);
      } else {
        handleClose();
        toast.success("Successfully Logged");
        ActiveUser.Name = data.result.name;
        ActiveUser.Email = data.result.email;
        ActiveUser.ProfilePic = data.result.userPic;
        setIsLogged(true);
      }
    } catch (error) {
      toast.error("Error: server has issues");
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-white dark:text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={OnLogin}>
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

          <div>
            <button
              type="submit"
              className="mb-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
