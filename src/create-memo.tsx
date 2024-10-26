import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { useState, useEffect } from "react";
import { MemoStorage } from "./storage/memo-storage";
import { Memo } from "./storage/types";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [memos, setMemos] = useState<Memo[]>([]);

  async function handleSubmit(memo: { title: string, desc: string, tag: string[]}) {
    try {
      await MemoStorage.createMemo(memo.title, memo.desc, memo.tag);
      showToast({ title: "Memo saved successfully", message: "success" });

    } catch (error) {
      showToast({title: "Error saving memo", message: "failure"})
    }

  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" placeholder="Memo Title" />
      <Form.TextArea 
        id="desc"
        title="description"
        placeholder="Meme Content (e.g: **bold**)"
        enableMarkdown
      />
      <Form.TagPicker id="tag" title="tag">
        <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />
      </Form.TagPicker>
    </Form>
  );
}
