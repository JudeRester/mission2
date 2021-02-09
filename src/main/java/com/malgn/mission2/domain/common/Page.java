package com.malgn.mission2.domain.common;

public class Page {
    private int startPage;
    private int endPage;
    private boolean prev, next;

    private int total;
    private Criteria crt;

    public Page(Criteria crt, int total) {
        this.crt = crt;
        this.total = total;
        this.endPage = (int) (Math.ceil(crt.getPageNum() / 5.0)) * 5;
        this.startPage = this.endPage - 4;
        int realEnd = (int) (Math.ceil(total * 1.0 / crt.getAmount()));

        if (realEnd < this.endPage) {
            this.endPage = realEnd;
        }
        this.prev = this.startPage > 1;
        this.next = this.endPage < realEnd;
    }

    @Override
    public String toString() {
        return "{" + " startPage='" + getStartPage() + "'" + ", endPage='" + getEndPage() + "'" + ", prev='" + isPrev()
                + "'" + ", next='" + isNext() + "'" + ", total='" + getTotal() + "'" + ", crt='" + getCrt() + "'" + "}";
    }

    public int getStartPage() {
        return startPage;
    }

    public void setStartPage(int startPage) {
        this.startPage = startPage;
    }

    public int getEndPage() {
        return endPage;
    }

    public void setEndPage(int endPage) {
        this.endPage = endPage;
    }

    public boolean isPrev() {
        return prev;
    }

    public void setPrev(boolean prev) {
        this.prev = prev;
    }

    public boolean isNext() {
        return next;
    }

    public void setNext(boolean next) {
        this.next = next;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Criteria getCrt() {
        return crt;
    }

    public void setCrt(Criteria crt) {
        this.crt = crt;
    }
}
