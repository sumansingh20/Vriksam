/* ------------------------------------------------------------------ */
/*  VRIKSHAM UI Component Library                                      */
/*  Barrel export file                                                 */
/* ------------------------------------------------------------------ */

// Button
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./card";
export type { CardProps } from "./card";

// Input
export { Input, inputSizeVariants } from "./input";
export type { InputProps } from "./input";

// Badge
export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

// Avatar
export { Avatar, AvatarGroup, avatarSizeVariants } from "./avatar";
export type { AvatarProps, AvatarGroupProps } from "./avatar";

// Modal
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
} from "./modal";
export type { ModalContentProps } from "./modal";

// Dropdown
export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownRadioGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
} from "./dropdown";
export type { DropdownItemProps } from "./dropdown";

// Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AnimatedTabsTrigger,
} from "./tabs";
export type { TabsListProps, TabsTriggerProps, AnimatedTabsTriggerProps } from "./tabs";

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
} from "./tooltip";
export type { SimpleTooltipProps } from "./tooltip";

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select";
export type { SelectTriggerProps, SelectItemProps } from "./select";

// Switch
export { Switch } from "./switch";
export type { SwitchProps } from "./switch";

// Progress
export { Progress } from "./progress";
export type { ProgressProps } from "./progress";

// Skeleton
export { Skeleton } from "./skeleton";
export type { SkeletonProps } from "./skeleton";

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table";
export type { TableProps, TableHeadProps } from "./table";

// Stat Card
export {
  StatCard,
  TrendIndicator,
  Sparkline,
  useAnimatedCounter,
} from "./stat-card";
export type { StatCardProps } from "./stat-card";

// Loading Spinner
export { LoadingSpinner, CircularSpinner } from "./loading-spinner";
export type { LoadingSpinnerProps, CircularSpinnerProps } from "./loading-spinner";
