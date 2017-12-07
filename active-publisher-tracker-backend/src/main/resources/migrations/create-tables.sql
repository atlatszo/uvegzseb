-- MySQL Workbench Forward Engineering

-- -----------------------------------------------------
-- Table `subscriber`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subscriber` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `subscription_date` DATETIME NOT NULL,
  `unsubscribe_token` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `account` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `keycloak_subject_uuid` CHAR(36) NOT NULL,
  `last_login_date` DATETIME NULL,
  `role_id` INT NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `keycloak_subject_uuid_UNIQUE` (`keycloak_subject_uuid` ASC),
  CONSTRAINT `fk_account_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data_owner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data_owner` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `short_name` VARCHAR(255) NOT NULL,
  `long_name` VARCHAR(255) NOT NULL,
  `weight` DECIMAL NOT NULL DEFAULT 1,
  `description` MEDIUMTEXT NULL,
  `uuid` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data_owner_email`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data_owner_email` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data_owner_id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_data_owner_emails_data_owners`
    FOREIGN KEY (`data_owner_id`)
    REFERENCES `data_owner` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `update`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `updates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `data_owner_id` INT NOT NULL,
  `category_id` INT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_updates_data_owner`
    FOREIGN KEY (`data_owner_id`)
    REFERENCES `data_owner` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_updates_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_updates_account`
    FOREIGN KEY (`user_id`)
    REFERENCES `account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `static_page`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `static_page` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` MEDIUMTEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `title_UNIQUE` (`title` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(512) NULL,
  `page_url` VARCHAR(2000) NULL,
  `document_url` VARCHAR(2000) NULL,
  `provided_date` DATETIME NULL,
  `update_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_data_updates1`
    FOREIGN KEY (`update_id`)
    REFERENCES `updates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
