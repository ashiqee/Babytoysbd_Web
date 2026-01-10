'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

export default function CreateLandingPageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageName, setPageName] = useState('');

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setPageName('');
  }

  function handleCreate() {
    if (!pageName.trim()) return;
    // Handle logic (API call, state update, etc.)
    alert(`Landing page "${pageName}" created!`);
    close();
  }

  return (
    <>
      <button
        onClick={open}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Create New Landing Page
      </button>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-md bg-white p-6 shadow-lg transition-all">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Create Landing Page
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-600">
                Give your new landing page a name.
              </p>

              <input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="e.g. Summer Sale Page"
                className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={close}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
