<template>
    <div>
        <b-card no-body class="overflow-hidden" style="width: 100%;"
                v-for="(project, index) in backedProjects" :key="index">
            <b-row id="projectRow" no-gutters @click="goProjectPage(project.project_name)">
                <b-col md="4">
                    <b-card-img src="https://picsum.photos/200/200" class="rounded-0"></b-card-img>
                </b-col>
                <b-col md="8">
                    <b-card-body :title="project.project_name">
                        <b-card-text>
                            <p>{{project.project_description}}</p>
                        </b-card-text>
                    </b-card-body>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "ProjectsBackedSection",
        props: {
            backedProjects: Array
        },
        computed: {

        },
        methods: {
            goProjectPage(projectName) {
                this.$router.push("/project/" + projectName)
            }
        }
    }
</script>

<style scoped>
    b-card-group {
        width: 500px;
    }

    #projectRow:hover {
        cursor: pointer;
    }
</style>