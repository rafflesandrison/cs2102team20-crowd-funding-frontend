<template>
    <b-container class="bv-example-row">
        <h2>Project Update</h2>
        <b-card
                :title="update.project_title"
                tag="article"
                style="max-width: 60rem;"
                class="mb-2"
                v-for="(update, index) in updates"
                :key="index"
        >
            <b-card-text>
                <h4>{{update.update_title}}</h4>
                <p>{{update.update_description}}</p>
            </b-card-text>
        </b-card>
    </b-container>
</template>

<script>
    export default {
        name: "UpdateSection",
        props: {
            updates: Array
        }
    }
</script>

<style scoped>

</style>