import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useState } from "react";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { logout, requireUserLogin } from "~/services/sessions.server";
import { deleteUser, getUserById, updateUser } from "~/services/users.server";
import { ImageUploader, Modal } from "~/components/molecules";
import { Button, InputField } from "~/components/atoms";

const schema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserLogin(request);
  const [user] = await getUserById(userId);
  return json({ user });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const submission = parse(formData, { schema });

  if (action === "save") {
    if (!submission.value || submission.intent !== "submit") {
      return json(submission, { status: 400 });
    }

    await updateUser(submission.value);
    return redirect("/home");
  }

  if (action === "delete" && submission.value?.id) {
    await deleteUser(submission.value.id);
    return logout(request);
  }

  return redirect("/home");
}

export default function ProfileSettings() {
  const { user } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [form, { firstName, id, lastName }] = useForm({
    id: "profile",
    lastSubmission,
    defaultValue: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  const [profileUrl, setProfileUrl] = useState(user.profileUrl);

  const handleFileUpload = async (file: File) => {
    const inputFormData = new FormData();

    inputFormData.append("profile-pic", file);

    const response = await fetch("/avatar", {
      method: "POST",
      body: inputFormData,
    });

    const { imageUrl } = await response.json();

    setProfileUrl(imageUrl);
  };

  return (
    <Modal onOutsideClick={() => navigate("/home")} isOpen className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          Your Profile
        </h2>
        <div className="flex">
          <div className="w-1/3">
            <ImageUploader onChange={handleFileUpload} imageUrl={profileUrl} />
          </div>
          <div className="flex-1">
            <Form method="post" {...form.props}>
              <input
                {...conform.input(id, {
                  hidden: true,
                })}
              />
              <InputField
                {...conform.input(firstName, { type: "text" })}
                label="First Name"
                error={firstName.error}
                errorId={firstName.errorId}
              />
              <InputField
                {...conform.input(lastName, { type: "text" })}
                label="Last Name"
                error={lastName.error}
                errorId={lastName.errorId}
              />
              <div className="mt-4 flex-col gap-1">
                <Button
                  className="w-full"
                  name="_action"
                  value="save"
                  disabled={
                    navigation.state === "submitting" ||
                    navigation.state === "loading"
                  }
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="w-full bg-red-300 hover:bg-red-400"
                  name="_action"
                  value="delete"
                  disabled={
                    navigation.state === "submitting" ||
                    navigation.state === "loading"
                  }
                  type="submit"
                >
                  Delete
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
