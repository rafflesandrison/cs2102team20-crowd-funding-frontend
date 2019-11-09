<template>
    <b-container class="bv-example-row">
        <div class="row bootstrap snippets container main">
            <div class="col-md-8 col-md-offset-2 col-sm-12">
            <div class="comment-wrapper">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        Feedback panel
                    </div>
                    <div class="panel-body">
                        
                        <div class="clearfix"></div>
                        <hr>
                        <ul class="media-list" v-for="(feedback, index) in feedback" :key="index">
                            <li class="media">
                                <a href="#" class="pull-left">
                                    <img v-bind:src="getProfileImage(feedback.email)" alt="" class="img-circle">
                                </a>
                                <div class="media-body">
                                <span class="text-muted pull-right">
                                    <small class="text-muted">30 min ago</small>
                                </span>
                                    <strong class="text-success">@{{feedback.email}}</strong>
                                    <p>
                                        {{feedback.feedback_text}}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </b-container>
</template>

<script>
    export default {
        name: "FeedbackSection",
        props: {
            feedback: Array
        },
        data() {
            return {
                newFeedback: '',
            }
        },
        methods: {
            postFeedback() {
                this.$emit("post:feedback", this.newFeedback)
            },
            getProfileImage(email) {
                return "https://picsum.photos/seed/" + email + "/200/300"
            }
        }
    }
</script>

<style scoped>
    body{margin-top:20px;}

    .comment-wrapper .panel-body {
        max-height:650px;
        overflow:auto;
    }

    .comment-wrapper .media-list .media img {
        width:64px;
        height:64px;
        border:2px solid #e5e7e8;
    }

    .comment-wrapper .media-list .media {
        border-bottom:1px dashed #efefef;
        margin-bottom:25px;
    }
</style>