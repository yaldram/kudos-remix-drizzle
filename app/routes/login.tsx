import bcrypt from "bcryptjs";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";

import { Button, InputField } from "~/components/atoms";
import { Layout } from "~/layouts/Layout";
import { userExists } from "~/services/users.server";
import { createUserSession, getUserId } from "~/services/sessions.server";

const schema = z.object({
  email: z.string().min(1, "Email is required.").email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return null;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const [user] = await userExists(submission.value.email);

  if (!user) {
    return json(
      {
        ...submission,
        error: {
          loginError: "User not found. Invalid email or password.",
        },
      },
      { status: 400 }
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    submission.value.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return json(
      {
        ...submission,
        error: {
          loginError: "User not found. Invalid email or password.",
        },
      },
      { status: 400 }
    );
  }

  return createUserSession(user.id, "/home");
}

export default function LoginPage() {
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const [form, { email, password }] = useForm({
    id: "login",
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
          to="/register"
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          Register
        </Link>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Kudos!
        </h2>
        <div className="font-semibold text-slate-300">
          <p className="font-semibold text-slate-300">
            Log in to give some praise!
          </p>
        </div>

        <Form
          method="POST"
          {...form.props}
          className="rounded-2xl bg-gray-200 p-6 w-96"
        >
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {lastSubmission?.error.loginError}
          </div>
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
              Login
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
