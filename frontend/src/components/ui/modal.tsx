"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/* ------------------------------------------------------------------ */
/*  Root & Trigger (pass-through)                                      */
/* ------------------------------------------------------------------ */

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

/* ------------------------------------------------------------------ */
/*  Overlay                                                            */
/* ------------------------------------------------------------------ */

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/40 backdrop-blur-sm",
        className
      )}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    />
  </DialogPrimitive.Overlay>
));
ModalOverlay.displayName = "ModalOverlay";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Size of the dialog */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Show close button */
  showClose?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size = "md", showClose = true, ...props }, ref) => (
  <ModalPortal forceMount>
    <AnimatePresence>
      <ModalOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            sizeMap[size],
            /* Glassmorphism */
            "rounded-2xl",
            "bg-white/80 dark:bg-gray-900/80",
            "backdrop-blur-2xl backdrop-saturate-150",
            "border border-white/30 dark:border-white/10",
            "shadow-2xl shadow-emerald-900/10",
            "p-0 overflow-hidden",
            "focus:outline-none",
            className
          )}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}

          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 z-10",
                "flex h-8 w-8 items-center justify-center rounded-full",
                "text-gray-400 transition-all duration-200",
                "hover:bg-gray-100 hover:text-gray-600",
                "dark:hover:bg-gray-800 dark:hover:text-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              )}
              aria-label="Close"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
              </svg>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </AnimatePresence>
  </ModalPortal>
));
ModalContent.displayName = "ModalContent";

/* ------------------------------------------------------------------ */
/*  Header / Body / Footer                                             */
/* ------------------------------------------------------------------ */

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1 px-6 pt-6 pb-2",
      className
    )}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-bold tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-6 py-4 overflow-y-auto", className)}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-3 px-6 py-4",
      "border-t border-gray-100/60 dark:border-gray-800/60",
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
};
