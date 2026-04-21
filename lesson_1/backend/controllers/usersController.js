const getAllUsers = (req, res) => {
  res.send("Get all users");
};

const getUser = (req, res) => {
  res.send("Get user");
};

const createUser = (req, res) => {
  res.send("Create user");
};

const updateUser = (req, res) => {
  res.send("Update user");
};

const deleteUser = (req, res) => {
  res.send("Delete user");
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
