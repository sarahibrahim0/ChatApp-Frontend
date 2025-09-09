import { motion, AnimatePresence } from "framer-motion";
import { PhoneIcon, PhoneXMarkIcon, VideoCameraIcon } from "@heroicons/react/24/solid";

const IncomingCallModal = ({ caller, onAccept, onReject }) => {
  const callTypeLabel =
    caller?.type === "video" ? "📹 Video Call" : "🎧 Voice Call";
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg font-semibold mb-2">{callTypeLabel}</p>
          <p className="text-blue-600 font-bold text-xl">
            {caller?.name || "Unknown"}
          </p>

          <div className="flex justify-center gap-8 mt-6">
            <button
              onClick={onAccept}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md"
            >
              {caller?.type === "video" ? (
                <VideoCameraIcon className="w-5 h-5" />
              ) : (
                <PhoneIcon className="w-5 h-5" />
              )}
              Accept
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md"
            >
              <PhoneXMarkIcon className="w-5 h-5" /> Reject
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCallModal;
