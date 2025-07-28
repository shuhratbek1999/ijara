import axios from "axios";
const BASE_URL = "http://localhost:5000/api/v1/admin-app";
const token = localStorage.getItem("token");

export async function getMessages({ myId, otherUserId }) {
  const res = await axios.get(
    `${BASE_URL}/message/one/${myId}/${otherUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
}
export async function getMyIncomingUsers() {
  const myId = localStorage.getItem("userID");
  console.log("salommm", myId);

  const res = await axios.get(`${BASE_URL}/message/incoming/${myId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // bu [ { id, name, email }, ... ]
}
