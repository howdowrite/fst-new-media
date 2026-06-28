import { getFirstNameInitial } from "../data/mockArticles";

interface InitialAvatarProps {
  name: string;
  size?: "sm" | "md";
}

export default function InitialAvatar({ name, size = "md" }: InitialAvatarProps) {
  const initial = getFirstNameInitial(name);

  return (
    <span
      className={`initial-avatar initial-avatar--${size}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
