import { Action, ActionPanel, Form, useNavigation, Icon, popToRoot, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { MemoStorage } from "./storage/memo-storage";
import { Memo } from "./storage/types";
import { useForm } from "@raycast/utils";

interface EditMemoProps {
  memo: Memo;
}

interface FormValues {
  title: string;
  content: string;
  tags?: string;
}

export default function Command({ memo }: EditMemoProps) {
  const { pop } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, itemProps, reset } = useForm<FormValues>({
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const updatedMemo: Memo = {
          ...memo,
          title: values.title,
          content: values.content,
        };

        await MemoStorage.updateMemo(memo.id, updatedMemo);
        await showToast({
          style: Toast.Style.Success,
          title: "Memo updated successfully",
        });
        await popToRoot();
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to update memo",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    },
    initialValues: {
      title: memo.title,
      content: memo.content,
    },
    validation: {
      title: (value) => {
        if (!value || value.trim().length === 0) {
          return "Title is required";
        }
      },
      content: (value) => {
        if (!value || value.trim().length === 0) {
          return "Content is required";
        }
      },
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Memo" onSubmit={handleSubmit} icon={Icon.Pencil} />
          <Action
            title="Reset"
            icon={Icon.ArrowCounterClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={reset}
          />
          <Action title="Cancel" icon={Icon.Xmark} shortcut={{ modifiers: ["cmd"], key: "." }} onAction={pop} />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      <Form.TextField {...itemProps.title} title="Title" placeholder="Enter memo title" />
      <Form.TextArea {...itemProps.content} title="Content" placeholder="Enter memo content" enableMarkdown />
      <Form.TextField {...itemProps.tags} title="Tags" placeholder="Enter tags separated by commas" />
    </Form>
  );
}
