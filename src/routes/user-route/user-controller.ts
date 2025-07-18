import { signUpUser } from "../user-route/user-handler";
export default function userController(server, options) {
    // Method: Post
    // Privacy: Public
    // Url: api/users/create
    server.post("/create", signUpUser);
}
