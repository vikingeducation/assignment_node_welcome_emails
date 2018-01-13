const MessageHelper = {};

MessageHelper.html = (fname, lname, email, password) => {
  return `<strong>Hey! Welcome aboard ${fname} ${lname}!</strong><br><br>
  Here is the data you submitted to us:<br><br>
  <table>
    <tr>
      <td>First name:</td>
      <td>${fname}</td>
    </tr>
    <tr>
      <td>Last name:</td>
      <td>${lname}</td>
    </tr>
    <tr>
      <td>Email:</td>
      <td>${email}</td>
    </tr>
    <tr>
      <td>Password:</td>
      <td>${password}</td>
    </tr>
  </table>`;
};

module.exports = MessageHelper;
