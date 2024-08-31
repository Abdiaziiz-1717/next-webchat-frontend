import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Dialogs({ Title, message, LogOut, setshowDialog }) {
  const cancelButtonRef = useRef(null);

  function YesAction() {
    LogOut();
    setshowDialog(false);
  }

  function close() {
    setshowDialog(false);
  }

  return (
    <Transition.Root show={true} as={Fragment} style={{ zIndex: 1060 }}>
      <Dialog
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={close}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center">
            {/* Center the dialog content */}
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="-mt-5 bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center">
                  {/* Added flex container */}
                  <div className="mb-5 mr-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mb-2 sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {Title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-mt-5 pt-2 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                <div className="flex justify-between w-full sm:justify-end">
                  <button
                    type="button"
                    className="mb-2 mr-2 inline-flex w-1/2 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3"
                    onClick={YesAction}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="mb-2 inline-flex w-1/2 justify-center rounded-md bg-success px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 "
                    onClick={close}
                    ref={cancelButtonRef}
                  >
                    No
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
