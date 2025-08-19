import axios from "axios";
const BASE_URL = "http://176.53.163.29:7005/api/v1/admin-app";
// const BASE_URL = "http://176.53.163.29:7005/api/v1/admin-app"
export async function getChattedUsers({ myId }) {
  const token = localStorage.getItem("token");
  let users = [];
  await axios
    .get(`${BASE_URL}/message/user/${myId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.data?.data) {
        users = [...res.data.data];
      }
    });
  return users;
  //   return res.data;
}
