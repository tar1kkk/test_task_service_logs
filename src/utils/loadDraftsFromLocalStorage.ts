import {Draft} from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = 'serviceDrafts';

// Функция для сохранения черновиков в LocalStorage
// @ts-ignore
export const saveDraftsToLocalStorage = (drafts: Draft[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
};

// Функция для загрузки черновиков из LocalStorage
// @ts-ignore
export const loadDraftsFromLocalStorage = (): Draft[] => {
    const drafts = localStorage.getItem(LOCAL_STORAGE_KEY);
    return drafts ? JSON.parse(drafts) : [];
};
