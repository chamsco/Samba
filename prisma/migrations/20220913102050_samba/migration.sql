/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders_Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductCommentsType" AS ENUM ('REVIEW', 'DISCUSSION');

-- CreateEnum
CREATE TYPE "ProductCommentsStatus" AS ENUM ('APPROVED', 'PENDING');

-- DropForeignKey
ALTER TABLE "Orders_Item" DROP CONSTRAINT "orders_item_order_id_foreign";

-- DropForeignKey
ALTER TABLE "Orders_Item" DROP CONSTRAINT "orders_item_product_id_foreign";

-- DropForeignKey
ALTER TABLE "Orders_Item" DROP CONSTRAINT "orders_item_user_id_foreign";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "orders_item_order_id_foreign";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "orders_item_product_id_foreign";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "product_shop_id_foreign";

-- DropForeignKey
ALTER TABLE "Product_Details" DROP CONSTRAINT "product_to_detail_id_foreign";

-- DropForeignKey
ALTER TABLE "Product_Image" DROP CONSTRAINT "product_shop_id_foreign";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "shop_owner_user_id_foreign";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "wishlist_product_id_foreign";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Orders_Item";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Shop";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cat_id" TEXT NOT NULL,
    "sub_cat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_comments" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "ProductCommentsType" DEFAULT 'REVIEW',
    "status" "ProductCommentsStatus" DEFAULT 'PENDING',
    "rating" INTEGER DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "product_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_Items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "ordered_at" TIMESTAMP(0) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Order_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "productCategoriesId" TEXT,
    "category_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isSubCategory" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToProductTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "store_ownerId_key" ON "store"("ownerId");

-- CreateIndex
CREATE INDEX "product_comments_author_Id_fkey" ON "product_comments"("authorId");

-- CreateIndex
CREATE INDEX "product_comments_product_Id_fkey" ON "product_comments"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_category_name_key" ON "product_categories"("category_name");

-- CreateIndex
CREATE INDEX "product_categories_productCategories_Id_fkey" ON "product_categories"("productCategoriesId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTags_AB_unique" ON "_ProductToProductTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTags_B_index" ON "_ProductToProductTags"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "shop_owner_user_id_foreign" FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_shop_id_foreign" FOREIGN KEY ("shop_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "orders_item_order_id_foreign" FOREIGN KEY ("cat_id") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "orders_item_product_id_foreign" FOREIGN KEY ("sub_cat_id") REFERENCES "Subcategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Items" ADD CONSTRAINT "orders_item_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order_Items" ADD CONSTRAINT "orders_item_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order_Items" ADD CONSTRAINT "orders_item_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productCategoriesId_fkey" FOREIGN KEY ("productCategoriesId") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Image" ADD CONSTRAINT "product_shop_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product_Details" ADD CONSTRAINT "product_to_detail_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "wishlist_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ProductToProductTags" ADD CONSTRAINT "_ProductToProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTags" ADD CONSTRAINT "_ProductToProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "product_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
