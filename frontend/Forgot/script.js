let forgotBtn = document.getElementById("forgotBtn");
const emailInput = document.querySelector("input[type='email']");

forgotBtn.addEventListener("click", () => {
  if (emailInput.value === "") {
    alert("Please enter your email");
    return;
  }

  alert("Password reset link sent");
  emailInput.value = "";
});
