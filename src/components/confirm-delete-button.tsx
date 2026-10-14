"use client";

import type { MouseEvent, ReactNode } from "react";

interface ConfirmDeleteButtonProps {
  message: string;
  className?: string;
  children: ReactNode;
}

/** Botón de envío que pide confirmación antes de dejar pasar el formulario de borrado. */
export function ConfirmDeleteButton({ message, className, children }: ConfirmDeleteButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <button type="submit" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
