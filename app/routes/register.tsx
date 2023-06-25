import { type ActionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";

import { createUser, userExists } from "~/services/users.server";
import { createUserSession } from "~/services/sessions.server";
import { Button, InputField } from "~/components/atoms";
import { Layout } from "~/layouts/Layout";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required.").email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const [emailTaken] = await userExists(submission.value.email);

  if (emailTaken) {
    return json(
      {
        ...submission,
        error: {
          email: "User already exists for the given email.",
        },
      },
      { status: 400 }
    );
  }

  const [user] = await createUser(submission.value);

  return createUserSession(user.id, "/home");
}

export default function RegisterPage() {
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const [form, { firstName, lastName, email, password }] = useForm({
    id: "register",
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <Link
          to="/login"
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          Login
        </Link>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Kudos!
        </h2>
        <div className="font-semibold text-slate-300">
          <p className="font-semibold text-slate-300">
            Register to get started!
          </p>
        </div>

        <Form
          method="POST"
          {...form.props}
          className="rounded-2xl bg-gray-200 p-6 w-96"
        >
          <InputField
            {...conform.input(firstName, {
              type: "text",
              ariaAttributes: true,
            })}
            label="First Name"
            error={firstName.error}
            errorId={firstName.errorId}
          />
          <InputField
            {...conform.input(lastName, { type: "text", ariaAttributes: true })}
            label="Last Name"
            error={lastName.error}
            errorId={lastName.errorId}
          />
          <InputField
            {...conform.input(email, { type: "email", ariaAttributes: true })}
            label="Email"
            error={email.error}
            errorId={email.errorId}
          />
          <InputField
            {...conform.input(password, {
              type: "password",
              ariaAttributes: true,
            })}
            label="Password"
            error={password.error}
            errorId={password.errorId}
          />

          <div className="w-full text-center">
            <Button
              disabled={
                navigation.state === "submitting" ||
                navigation.state === "loading"
              }
              type="submit"
            >
              Register
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
