import { CheckCircle, Clock, XCircle } from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case "resolved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};
export default getStatusIcon;
