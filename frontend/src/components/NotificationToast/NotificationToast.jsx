import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./NotificationToast.css";
const useNotificationToast = () => {
  const navigate = useNavigate();

  const notify = ({ message, type = "success", autoClose = 1500, shouldRedirect = false, redirectPath = "/" }) => {
    const toastOptions = {
      autoClose,
      closeButton: false,
      closeOnClick: true,
      draggable: false,
      hideProgressBar: true,
      style: {
        background: "#222",
        color: "white",
        border: "1px solid #444",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "bold",
        width: "250px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      },
    };

    if (type === "success") {
      toast.success(message, toastOptions);
    } else if (type === "error") {
      toast.error(message, toastOptions);
    } else {
      toast.info(message, toastOptions); 
    }

    if (shouldRedirect) {
      setTimeout(() => navigate(redirectPath), autoClose);
    }
  };

  return notify;
};

export default useNotificationToast;
