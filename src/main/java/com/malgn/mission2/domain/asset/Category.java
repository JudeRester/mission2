package com.malgn.mission2.domain.asset;

public class Category {
    private int categoryId;
    private String categoryName;
    private int categoryParent;
    private int categoryOrder;
    private int level;
    private int possessions;

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getCategoryParent() {
        return categoryParent;
    }

    public void setCategoryParent(int categoryParent) {
        this.categoryParent = categoryParent;
    }

    public int getCategoryOrder() {
        return categoryOrder;
    }

    public void setCategoryOrder(int categoryOrder) {
        this.categoryOrder = categoryOrder;
    }

    @Override
    public String toString() {
        return "Category [categoryId=" + categoryId + ", categoryName=" + categoryName + ", categoryParent="
                + categoryParent + ", categoryOrder=" + categoryOrder + ", level=" + level + ", possesions="
                + possessions + "]";
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getPossessions() {
        return possessions;
    }

    public void setPossessions(int possesions) {
        this.possessions = possesions;
    }
}
