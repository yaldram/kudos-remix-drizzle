import { useState } from "react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import { z } from "zod";
import {
  useLoaderData,
  useActionData,
  useNavigation,
  Form,
  useNavigate,
} from "@remix-run/react";

import type { KudoStyle } from "~/utils/constants";
import { requireUserLogin } from "~/services/sessions.server";
import { getUserById } from "~/services/users.server";
import { createKudo } from "~/services/kudos.server";
import { KudoCard, Modal } from "~/components/molecules";
import { Avatar, Button, SelectField } from "~/components/atoms";
import { getUserProfile } from "~/utils/helpers";
import {
  backgroundColorMap,
  bgColorEnum,
  emojiEnum,
  emojiMap,
  textColorEnum,
  textColorMap,
} from "~/utils/constants";

const defaultTodo = {
  message: "",
  style: {
    backgroundColor: "blue",
    textColor: "white",
    emoji: "handsup",
  } as KudoStyle,
};

const getSelectOptions = (data: Record<string, string>) =>
  Object.keys(data).reduce((acc: { name: string; value: string }[], curr) => {
    acc.push({
      name: curr.charAt(0).toUpperCase() + curr.slice(1).toLowerCase(),
      value: curr,
    });
    return acc;
  }, []);

const schema = z.object({
  recipientId: z.string(),
  authorId: z.string(),
  message: z.string().min(1, "Message is required"),
  backgroundColor: z.enum(bgColorEnum),
  textColor: z.enum(textColorEnum),
  emoji: z.enum(emojiEnum),
});

export async function loader({ request, params }: LoaderArgs) {
  const { recipientId } = params;
  const userId = await requireUserLogin(request);

  if (typeof recipientId !== "string") return redirect("/home");

  const [[author], [recipient]] = await Promise.all([
    getUserById(userId),
    getUserById(recipientId),
  ]);

  return json({ author, recipient });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  await createKudo({
    message: submission.value.message,
    style: {
      backgroundColor: submission.value.backgroundColor,
      textColor: submission.value.textColor,
      emoji: submission.value.emoji,
    },
    authorId: submission.value.authorId,
    recipientId: submission.value.recipientId,
  });

  return redirect("/home");
}

export default function CreateKudoModal() {
  const { author, recipient } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [kudo, setKudo] = useState(defaultTodo);

  const [
    form,
    { recipientId, authorId, message, backgroundColor, textColor, emoji },
  ] = useForm({
    id: "kudo",
    lastSubmission,
    defaultValue: {
      message: defaultTodo.message,
      ...defaultTodo.style,
      recipientId: recipient.id,
      authorId: author.id,
    },
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  const onFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    // @ts-expect-error: Type mismatch
    const { name, value } = event.target;
    if (name === "message") {
      return setKudo((kudo) => ({
        ...kudo,
        message: value,
      }));
    }

    // Handle the styles update
    setKudo((kudo) => ({
      ...kudo,
      style: {
        ...kudo.style,
        [name]: value,
      },
    }));
  };

  return (
    <Modal
      onOutsideClick={() => {
        navigate("/home");
      }}
      isOpen
      className="w-2/3 p-10"
    >
      <Form {...form.props} onChange={onFormChange} method="post">
        <input
          {...conform.input(recipientId, {
            hidden: true,
          })}
        />
        <input
          {...conform.input(authorId, {
            hidden: true,
          })}
        />
        <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0">
          <div className="text-center flex flex-col items-center gap-y-2 pr-8">
            <Avatar
              userProfile={getUserProfile(recipient)}
              className="h-24 w-24"
            />
            <p className="text-blue-300">
              {recipient.firstName} {recipient.lastName}
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-y-4">
            <textarea
              {...conform.input(message, { ariaAttributes: true })}
              className="w-full rounded-xl h-40 p-4"
              placeholder={`Say something nice about ${recipient.firstName}...`}
            />
            <div
              id={message.errorId}
              className="text-xs font-semibold text-center tracking-wide text-red-500 w-full"
            >
              {message.error}
            </div>
            <div className="flex flex-col items-center md:flex-row md:justify-start gap-x-4">
              <SelectField
                options={getSelectOptions(backgroundColorMap)}
                {...conform.select(backgroundColor, { ariaAttributes: true })}
                label="Background Color"
                containerClassName="w-36"
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                error={backgroundColor.error}
                errorId={backgroundColor.errorId}
              />
              <SelectField
                options={getSelectOptions(textColorMap)}
                {...conform.select(textColor, { ariaAttributes: true })}
                label="Text Color"
                containerClassName="w-36"
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                error={textColor.error}
                errorId={textColor.errorId}
              />
              <SelectField
                options={getSelectOptions(emojiMap)}
                {...conform.select(emoji, { ariaAttributes: true })}
                label="Emoji"
                containerClassName="w-36"
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                error={emoji.error}
                errorId={emoji.errorId}
              />
            </div>
          </div>
        </div>
        <br />
        <p className="text-blue-600 font-semibold mb-2">Preview</p>
        <div className="flex flex-col items-center md:flex-row gap-x-24 gap-y-2 md:gap-y-0">
          <KudoCard userProfile={getUserProfile(author)} kudo={kudo} />
          <div className="flex-1" />
          <Button
            disabled={
              navigation.state === "submitting" ||
              navigation.state === "loading"
            }
            type="submit"
          >
            Send
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
