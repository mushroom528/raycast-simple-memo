import { ActionPanel, Detail, List, Action, Icon, showToast } from "@raycast/api";
import { useState, useEffect } from "react";
import { MemoStorage } from "./storage/memo-storage";
import { Memo } from "./storage/types";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    loadMemos();
  }, []);

  async function loadMemos() {
    try {
      setIsLoading(true);
      const loadedMemos = await MemoStorage.getAllMemos();
      setMemos(loadedMemos);
    } catch (error) {
      showToast({
        title: "Error loading memos",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <List isShowingDetail searchBarPlaceholder="Search Memo...">
      {memos.map(memo => (
        <List.Item
          key={memo.id}
          icon={Icon.Document}
          title={memo.title}
          accessories={[{ text: memo.title }]}
          detail={
            <List.Item.Detail
              markdown={memo.content}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Information" />
                  <List.Item.Detail.Metadata.Label title="Name" text={memo.title} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Content type" text="Text" />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Times copied" text="60" />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label 
                    title="Last copied" 
                    text="Yesterday at 6:14:45 PM" 
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy to Clipboard"
                content={memo.content}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}