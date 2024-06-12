if (!localStorage.getItem("token")) {
  document.body.innerHTML += `
<div class="login-form-container show">
  <div class="fas fa-times" id="close-login-btn"></div>
  <form action="">
    <h3>sign in</h3>
    <span>username</span>
    <input type="email" name="email" class="box" placeholder="enter your email" required>
    <span>password</span>
    <input type="password" name="password" class="box" placeholder="enter your password" required>
    <div class="checkbox">
      <input type="checkbox" name="" id="remmember-me">
      <label for="remmember-me">remmember me</label>
    </div>
    <div class="message-serv2"></div>
    <input type="submit" value="sign in" onclick="signIn()">
  </form>
</div>
  `;
}

const api = "https://gara4ko.onrender.com";

// let api = "http://localhost:3000";

function signIn() {
  document
    .querySelector(".login-form-container form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const email = formData.get("email");
      const password = formData.get("password");

      console.log("Submitting:", JSON.stringify({ email, password }));

      try {
        const response = fetch(`${api}/api/v1/auth/signIn`, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((res) => res)
          .then((data) => data.json())
          .then((data) => {
            localStorage.setItem("token", data.token);
            location.reload();
          })
          .catch((err) => console.log("err", err));

        // const data =  response.json();

        // if (data.success) {
        //   localStorage.setItem("token", data.token);
        //   location.reload();
        // } else {
        //   console.log("Login failed:", data);
        //   document.querySelector(".message-serv2").innerText =
        //     "wrong email or password";
        // }
      } catch (error) {
        console.error("Fetch error:", error);
        // document.querySelector(".message-serv2").innerText =
        //   "An error occurred. Please try again.";
      }
    });
}
function deleteTokenAndConfirm() {
  // Show the SweetAlert confirmation
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // If the user confirms, delete the token from local storage
      localStorage.removeItem("token");

      // Show a success message
      Swal.fire("Deleted!", "Your token has been deleted.", "success");

      location.reload();
    }
  });
}

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.add("close");
}

function closeBtn() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("close");
}

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWQzOGNjOWFjNmQ4NmZhYzcxNjBkMCIsImVtYWlsIjoiYWhtZWRraW5na2lsYW55MUBnbWFpbC5jb20iLCJ1c2VyTmFtZSI6ImFobWVkIGtpbGFueSIsImNyZWF0ZWRBdCI6IjIwMjQtMDYtMDNUMDM6MzA6MjAuNDcyWiIsInJvbGUiOiJzdXBlckFkbWluIiwiaWF0IjoxNzE3NzExMDQzLCJleHAiOjE3MTg0ODg2NDN9.O4azreeRecuZU6OaBpPo7iaM3DxFVASKs88DkLCQ9xk";
const token = localStorage.getItem("token");

async function fetchUserData() {
  const response = await fetch(`${api}/api/v1/analysis/users`, {
    method: "GET",
    headers: {
      token: token,
    },
  });

  const data = await response.json();
  // console.log(data);
  return data;
}
function fetchAndDisplayUserData() {
  const usersDataSection = document.querySelector(".usersData");
  usersDataSection.classList.add("grid-boxes");

  fetch(`${api}/api/v1/user/users`, {
    method: "GET",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result.success && Array.isArray(result.data)) {
        usersDataSection.innerHTML = ""; // Clear any existing content

        result.data.forEach((user) => {
          const userCard = document.createElement("div");
          userCard.className = "userCard";

          userCard.innerHTML = `
            <div class="headCard">
              <img src="img/prof1.png" alt="profile">
              <h3>${user.userName}</h3>
            </div>

            <div class="subCard">
            <span>Email:</span>
              <p>${user.email}</p>
            </div>

            <div class="subCard">
              <span>Phone Number:</span>
              <p>${user.phoneNumber}</p>
            </div>

            <div class="subCard">
              <span>Role:</span>
              <p>${user.role}</p>
            </div>

            <div class="subCard">
              <span>Email Verified:</span>
              <p>${user.isEmailVerified ? "Yes" : "No"}</p>
            </div>

            <div class="subCard">
              <span>Active:</span>
              <p>${user.isActive ? "Yes" : "No"}</p>
            </div>

            <div class="subCard">
              <span>Created At:</span>
              <p>${new Date(user.createdAt).toLocaleString()}</p>
            </div>

            <div class="subCard">
              <span>Updated At:</span>
              <p>${new Date(user.updatedAt).toLocaleString()}</p>
            </div>

            <form class="amountForm" onsubmit="addAmount(event, '${user._id}')">
              <label for="amount" class="amount-title">Add Amount <i class="fa-solid fa-circle-dollar-to-slot"></i></label>
              <p id="total_${user._id}">${user?.wallet?.total}$</p>
              <input type="number" id="amount_${
                user._id
              }" name="amount" required>
              <input type="submit" value="Add Amount">
            </form>
            <button class="btn" onclick="deleteUser('${
              user._id
            }')">Delete</button>
          `;

          usersDataSection.appendChild(userCard);
          console.log(user._id);

          // Fetch wallet total for each user
          fetchWalletTotal(user._id);
        });
      } else {
        console.error("Invalid user data format", result);
        throw new Error("Invalid user data format");
      }
    })
    .catch((error) =>
      console.error("There was a problem with the fetch operation:", error)
    );
}

function fetchWalletTotal(userId) {
  fetch(`${api}/api/v1/wallets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched wallet data:", data); // Add logging to check fetched data
      if (data.success && Array.isArray(data.data)) {
        const wallet = data.data.find(
          (wallet) => wallet.user && wallet.user._id === userId
        );

        if (wallet) {
          document.getElementById(
            `total_${userId}`
          ).innerText = `Total: ${data.data.total}`;
        } else {
          document.getElementById(`total_${userId}`).innerText =
            "No wallet found";
        }
      } else {
        console.error("Failed to fetch wallet details", data);
        document.getElementById(`total_${userId}`).innerText =
          "Error fetching wallet";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(`total_${userId}`).innerText =
        "Error fetching wallet";
    });
}

function addAmount(event, userId) {
  event.preventDefault();
  const amount = document.getElementById(`amount_${userId}`).value;

  fetch(`${api}/api/v1/wallet/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({ amount: parseFloat(amount) }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data.data.total);
        swal(
          "Success!",
          `${data.message} Total: ${data.data.total}`,
          "success"
        );
        document.getElementById(
          `total_${userId}`
        ).innerText = `Total: ${data.data.total}`;
      } else {
        throw new Error(data.message || "Failed to add amount");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      swal("Error", error.message, "error");
    });
}
function deleteUser(userId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${api}/api/v1/user/${userId}`, {
        method: "DELETE",
        headers: {
          token: token, // تأكد من استخدام التوكن الفعلي الخاص بك هنا
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
            // Remove the user element from the DOM or refresh the user list
            fetchAndDisplayUserData(); // Call the function to refresh the list
          } else {
            Swal.fire(
              "Error!",
              "There was a problem deleting the user.",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error(
            "There was a problem with the delete operation:",
            error
          );
          Swal.fire(
            "Error!",
            "There was a problem deleting the user.",
            "error"
          );
        });
    }
  });
}

async function fetchVehicleData() {
  const response = await fetch(
    `${api}/api/v1/analysis/vehicles`,
    {
      method: "GET",
      headers: {
        token: token,
      },
    }
  );

  if (!response.ok) {
    console.error("Server error:", response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}

async function fetchParkingData() {
  const response = await fetch(
    `${api}/api/v1/analysis/parking`,
    {
      method: "GET",
      headers: {
        token: token,
      },
    }
  );

  if (!response.ok) {
    console.error("Server error:", response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}

async function fetchReservationData() {
  const response = await fetch(
    `${api}/api/v1/analysis/reservation`,
    {
      method: "GET",
      headers: {
        token: token,
      },
    }
  );

  if (!response.ok) {
    console.error("Server error:", response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}

async function renderCharts() {
  const userData = await fetchUserData();
  const vehicleData = await fetchVehicleData();
  const parkingData = await fetchParkingData();
  const reservationData = await fetchReservationData();

  // const userData = [];
  // const vehicleData = [];
  // const parkingData = [];
  // const reservationData = [];

  // if (!userData || !userData.data || !userData.labels) {
  //   console.error("Invalid user data format");
  //   return;
  // }

  // if (!vehicleData || !vehicleData.data || !vehicleData.labels) {
  //   console.error("Invalid vehicle data format");
  //   return;
  // }

  // if (!parkingData || !parkingData.data || !parkingData.labels) {
  //   console.error("Invalid parking data format");
  //   return;
  // }

  // if (!reservationData || !reservationData.data || !reservationData.labels) {
  //   console.error("Invalid reservation data format");
  //   return;
  // }

  var options1 = {
    series: [
      {
        name: "Net Profit",
        data: userData?.data || [],
      },
      {
        name: "Revenue",
        data: userData?.data || [],
      },
      {
        name: "Free Cash Flow",
        data: userData?.data || [],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: userData?.labels || [],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
  chart1.render();

  var options2 = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "sales",
        data: userData?.data || [],
      },
    ],
    xaxis: {
      categories: userData?.labels || [],
    },
  };

  var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
  chart2.render();

  // Adding new charts for vehicle data
  var options3 = {
    series: [
      {
        name: "Vehicle Data 1",
        data: vehicleData?.data || [],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: vehicleData?.labels || [],
    },
    yaxis: {
      title: {
        text: "Vehicle Metric",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " units";
        },
      },
    },
  };

  var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
  chart3.render();

  var options4 = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "Vehicle Data 2",
        data: vehicleData?.data || [],
      },
    ],
    xaxis: {
      categories: vehicleData?.labels || [],
    },
  };

  var chart4 = new ApexCharts(document.querySelector("#chart4"), options4);
  chart4.render();

  // Adding new charts for parking data
  var options5 = {
    series: [
      {
        name: "Parking Data",
        data: parkingData?.data || [],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: parkingData?.labels || [],
    },
    yaxis: {
      title: {
        text: "Parking Metric",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " units";
        },
      },
    },
  };

  var chart5 = new ApexCharts(document.querySelector("#chart5"), options5);
  chart5.render();

  // Adding new charts for reservation data
  var options6 = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "Reservation Data",
        data: reservationData?.data || [],
      },
    ],
    xaxis: {
      categories: reservationData?.labels || [],
    },
  };

  var chart6 = new ApexCharts(document.querySelector("#chart6"), options6);
  chart6.render();
}

//********************************************** */
//********************************************** */
//********************************************** */
//********************************************** */
//********************************************** */

// }

function getStars(rating) {
  // تحويل التقييم إلى عدد صحيح
  rating = Math.round(rating);

  let stars = "";
  // إضافة نجمة صلبة لكل نقطة تقييم
  for (let i = 0; i < rating; i++) {
    stars += '<i class="fas fa-star y-star"></i>';
  }
  // إضافة نجمة فارغة للنقاط المتبقية
  for (let i = 0; i < 5 - rating; i++) {
    stars += '<i class="far fa-star d-star"></i>';
  }
  return stars;
}

function fetchWallets() {
  fetch(`${api}/api/v1/wallet`, {
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const wallets = data.data;
      displayWallets(wallets);
    })
    .catch((error) => console.error("Error:", error));
}

function displayWallets(wallets) {
  const container = document.getElementById("walletsContainer");
  // container.innerHTML = ""; // تفريغ الحاوية قبل عرض المحافظ

  wallets.forEach((wallet) => {
    const walletDiv = document.createElement("div");
    walletDiv.className = "wallet";

    walletDiv.innerHTML = `
                    <p><strong>ID:</strong> ${wallet._id}</p>
                    <p><strong>User Name:</strong> ${
                      wallet.user ? wallet.user.userName : "N/A"
                    }</p>
                    <p><strong>Email:</strong> ${
                      wallet.user ? wallet.user.email : "N/A"
                    }</p>
                    <p><strong>Phone Number:</strong> ${
                      wallet.user ? wallet.user.phoneNumber : "N/A"
                    }</p>
                    <p><strong>Role:</strong> ${
                      wallet.user ? wallet.user.role : "N/A"
                    }</p>
                    <p><strong>Total:</strong> ${wallet.total}</p>
                    <p><strong>Active:</strong> ${wallet.active}</p>
                    <p><strong>Created At:</strong> ${new Date(
                      wallet.createdAt
                    ).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> ${new Date(
                      wallet.updatedAt
                    ).toLocaleString()}</p>
                `;

    container.appendChild(walletDiv);
  });
}

// services

//***********************

function allServ() {
  const gridBoxes = document.querySelector(".grid-boxes");

  fetch(`${api}/api/v1/service`, {
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.data.length; i++) {
        const box = document.createElement("div");
        box.className = "box";

        box.innerHTML = `
        <h3 class="parkName">${data.data[i].service_type}</h3>
        <p class="location">credit Point: ${data.data[i].creditPoint} </p>
        <p class="location">discount: ${data.data[i].discount}</p>

        <div class="btns">
          <a href="#" class="btn edit-btn" data-id="${data.data[i]._id}">edit</a>
          <a href="#" class="btn delete-btn" data-id="${data.data[i]._id}">delete</a>
        </div>
        `;

        gridBoxes.appendChild(box);
      }

      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", deleteService);
      });
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", editService);
      });
    })
    .catch((error) => console.error("Error:", error));
}

function editService(event) {
  event.preventDefault();

  const id = event.target.getAttribute("data-id");
  const editForm = document.getElementById("editForm");
  const serviceEdit = document.getElementById("serviceEdit");

  editForm.style.display = "block";

  serviceEdit.addEventListener("submit", function (e) {
    e.preventDefault();

    const service_type = document.getElementById("service_typeEdit").value;
    const creditPoint = document.getElementById("creditPointEdit").value;
    const discount = document.getElementById("discountEdit").value;

    fetch(`${api}/api/v1/service/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        service_type: service_type,
        creditPoint: creditPoint,
        discount: discount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        swal("تم تعديل الخدمة بنجاح!", {
          icon: "success",
        });
        hideFormAndReload();
      })
      .catch((error) => {
        console.error("Error:", error);
        swal("حدث خطأ أثناء تعديل الخدمة!", {
          icon: "error",
        });
        hideFormAndReload();
      });
  });

  function hideFormAndReload() {
    editForm.style.display = "none";
    setTimeout(function () {
      location.reload();
    }, 3000);
  }

  // إضافة مستمع الأحداث للزر 'closeEdit'
  document.getElementById("closeEdit").addEventListener("click", function () {
    editForm.style.display = "none";
  });
}

function deleteService(event) {
  // منع الأحداث الافتراضية
  event.preventDefault();

  // الحصول على ال id
  const id = event.target.getAttribute("data-id");

  // تأكيد الحذف
  swal({
    title: "هل أنت متأكد؟",
    text: "بمجرد الحذف، لن تتمكن من استعادة هذه الخدمة!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      // الطلب لحذف الخدمة
      fetch(`${api}/api/v1/service/${id}`, {
        method: "DELETE",
        headers: {
          token: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // إعادة تحميل الخدمات
          // تنبيه النجاح
          swal("تم حذف الخدمة بنجاح!", {
            icon: "success",
          });
          setTimeout(function () {
            location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
          // تنبيه الخطأ
          swal("حدث خطأ أثناء حذف الخدمة!", {
            icon: "error",
          });
        });
    } else {
      swal("تم إلغاء الحذف!");
    }
  });
}
