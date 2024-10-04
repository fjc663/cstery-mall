import { defineStore } from "pinia";
import { ref } from "vue";

export const useAdminInfoStore = defineStore('adminInfo', () => {
    const token = ref<string>('');
    const username = ref<string>('');
    const avatarUrl = ref<string>('');
    const role = ref<string>('');

    function setToken(newToken: string) {
        token.value = newToken;
    }

    function setUsername(newUsername: string) {
        username.value = newUsername;
    }

    function setAvatar(newAvatarUrl: string) {
        avatarUrl.value = newAvatarUrl;
    }

    function setRole(newRole: string) {
        role.value = newRole;
    }

    function remove() {
        token.value = '';
        username.value = '';
        avatarUrl.value = '';
        role.value = '';
    }

    return { token, username, avatarUrl, role, setToken, setUsername, setAvatar, remove, setRole }

},
    {
        persist: true
    }
)