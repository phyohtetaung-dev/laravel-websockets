import './bootstrap';
import { createApp } from 'vue';
import ChatForm from './components/ChatForm.vue';
import ChatMessages from './components/ChatMessages.vue';

const app = createApp({
    data() {
        return {
            messages: [],
            users: [],
        }
    },

    mounted() {
        this.fetchMessages();

        Echo.join('chat')
            .here(users => {
                this.users = users;
            })
            .joining(user => {
                this.users.push(user);
            })
            .leaving(user => {
                this.users = this.users.filter(u => u.id !== user.id);
            })
            .listenForWhisper('typing', ({ id, name }) => {
                this.users.forEach((user, index) => {
                    if (user.id === id) {
                        user.typing = true;
                        this.users[index] = user;
                    }
                });
            })
            .listen('SendChatMessage', (event) => {
                this.messages.push({
                    message: event.message.message,
                    user: event.user
                });

                this.users.forEach((user, index) => {
                    if (user.id === event.user.id) {
                        user.typing = false;
                        this.users[index] = user;
                    }
                });
            });
    },

    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                this.messages = response.data;
            });
        },

        addMessage(message) {
            this.messages.push(message);

            axios.post('/messages', message).then(response => {
                console.log(response.data);
            });
        }
    }
});

app.component('chat-form', ChatForm);
app.component('chat-messages', ChatMessages);
app.mount('#app');
