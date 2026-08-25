CREATE TABLE `conversationMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversationMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `conversation_members_idx` UNIQUE(`conversationId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('private','group') NOT NULL DEFAULT 'private',
	`title` varchar(160),
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageAttachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`byteSize` int NOT NULL,
	`width` int,
	`height` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageAttachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`body` text,
	`kind` enum('text','image') NOT NULL DEFAULT 'text',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`username` varchar(64) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`connectionMode` enum('Partner','Family','Friends','Private group') NOT NULL DEFAULT 'Partner',
	`avatarUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `profiles_username_idx` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE INDEX `conversations_created_by_idx` ON `conversations` (`createdBy`);--> statement-breakpoint
CREATE INDEX `message_attachments_message_idx` ON `messageAttachments` (`messageId`);--> statement-breakpoint
CREATE INDEX `messages_conversation_idx` ON `messages` (`conversationId`,`createdAt`);