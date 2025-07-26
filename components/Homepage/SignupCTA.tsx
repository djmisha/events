import Signup from "../User/Signup";

export default function SignupCTA() {
  return (
    <section className="flex justify-between p-8 bg-gray-50 rounded-lg shadow-md my-8 flex-col md:flex-row">
      <div className="flex-1 mb-8 md:mr-8 md:mb-0">
        <h2>Create a Free Account Today!</h2>
        <ul>
          <li>Save your default location</li>
          <li>Add favorite artists</li>
          <li>Coming soon: favorite venues</li>
          <li>And much more...</li>
        </ul>
      </div>
      <div className="flex-1">
        <Signup />
      </div>
    </section>
  );
}
