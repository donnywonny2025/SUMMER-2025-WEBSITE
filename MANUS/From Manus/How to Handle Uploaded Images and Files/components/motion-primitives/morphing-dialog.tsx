'use client';

import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, Transition, HTMLMotionProps } from 'motion/react';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLElement>;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error('MorphingDialog components must be used within MorphingDialog');
  }
  return context;
}

interface MorphingDialogProps {
  children: React.ReactNode;
  transition?: Transition;
}

export function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <MorphingDialogContext.Provider value={{ isOpen, setIsOpen, uniqueId, triggerRef }}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

interface MorphingDialogTriggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export function MorphingDialogTrigger({ children, ...props }: MorphingDialogTriggerProps) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef as any}
      layoutId={`dialog-${uniqueId}`}
      onClick={() => setIsOpen(true)}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface MorphingDialogContainerProps {
  children: React.ReactNode;
}

export function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, setIsOpen } = useMorphingDialog();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MorphingDialogContentProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export function MorphingDialogContent({ children, ...props }: MorphingDialogContentProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-${uniqueId}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface MorphingDialogImageProps extends HTMLMotionProps<'img'> {
  src: string;
  alt: string;
}

export function MorphingDialogImage({ src, alt, ...props }: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      src={src}
      alt={alt}
      {...props}
    />
  );
}

interface MorphingDialogTitleProps extends HTMLMotionProps<'h3'> {
  children: React.ReactNode;
}

export function MorphingDialogTitle({ children, ...props }: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.h3
      layoutId={`dialog-title-${uniqueId}`}
      {...props}
    >
      {children}
    </motion.h3>
  );
}

interface MorphingDialogSubtitleProps extends HTMLMotionProps<'p'> {
  children: React.ReactNode;
}

export function MorphingDialogSubtitle({ children, ...props }: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.p
      layoutId={`dialog-subtitle-${uniqueId}`}
      {...props}
    >
      {children}
    </motion.p>
  );
}

interface MorphingDialogDescriptionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  disableLayoutAnimation?: boolean;
  variants?: any;
}

export function MorphingDialogDescription({ 
  children, 
  disableLayoutAnimation, 
  variants,
  ...props 
}: MorphingDialogDescriptionProps) {
  return (
    <motion.div
      initial={variants?.initial}
      animate={variants?.animate}
      exit={variants?.exit}
      transition={{ delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface MorphingDialogCloseProps extends HTMLMotionProps<'button'> {
  className?: string;
}

export function MorphingDialogClose({ className, ...props }: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <motion.button
      onClick={() => setIsOpen(false)}
      className={`absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors ${className}`}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </motion.button>
  );
}
