import { useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
function Logout() {
  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();
  return (
    <>
      <button
        className="dropdown-item ai-icon"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <svg
          id="icon-logout"
          xmlns="http://www.w3.org/2000/svg"
          className="text-danger"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1={21} y1={12} x2={9} y2={12} />
        </svg>
        <span className="ms-2">Logout </span>
      </button>
    </>
  );
}
export default Logout;
