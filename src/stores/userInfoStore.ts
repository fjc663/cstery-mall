import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore('userInfo', () => {
    const token = ref<string>('');
    const username = ref<string>('');
    const avatarUrl = ref<string>('');

    function setTokenAndUsername(newToken: string, newUsername: string, newAvatarUrl: string) {
        token.value = newToken;
        username.value = newUsername;
        avatarUrl.value = newAvatarUrl;
    }

    function removeTokenAndUsername() {
        token.value = '';
        username.value = '';
        avatarUrl.value = '';
    }

    return { token, username, avatarUrl, setTokenAndUsername, removeTokenAndUsername }

},
    {
        persist: true
    }
)