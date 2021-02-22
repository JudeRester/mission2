package com.malgn.mission2.domain.common;

public class Response<T, E> {
    private T result;
    private E reference;
    private String message;
    private int code;

    public Response() {
    }

    public Response<T, E> success(T result, E reference) {
        return new Response<T, E>(result, reference, "성공", 200);
    }

    public Response<T, E> failed(T result, E reference) {
        return new Response<T, E>(result, reference, "실패", 403);
    }

    public Response(T result, E reference, String message, int code) {
        this.result = result;
        this.reference = reference;
        this.message = message;
        this.code = code;
    }

    public T getResult() {
        return result;
    }

    public Response<T, E> setResult(T result) {
        this.result = result;
        return this;
    }

    public E getReference() {
        return reference;
    }

    public Response<T, E> setReference(E reference) {
        this.reference = reference;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public Response<T, E> setMessage(String message) {
        this.message = message;
        return this;
    }

    public int getCode() {
        return code;
    }

    public Response<T, E> setCode(int code) {
        this.code = code;
        return this;
    }

    @Override
    public String toString() {
        return "{" + " result='" + getResult() + "'" + ", reference='" + getReference() + "'" + ", message='"
                + getMessage() + "'" + ", code='" + getCode() + "'" + "}";
    }

}
