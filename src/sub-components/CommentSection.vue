<template>
    <b-container class="bv-example-row">
        <div class="row bootstrap snippets container main">
            <div class="col-md-8 col-md-offset-2 col-sm-12">
            <div class="comment-wrapper">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        Comment panel
                    </div>
                    <div class="panel-body">
                        <textarea
                                v-model="newComment"
                                class="form-control" placeholder="write a comment..." rows="3"></textarea>
                        <br>
                        <button type="button" class="btn btn-info pull-right" @click="postComment">Post</button>
                        <div class="clearfix"></div>
                        <hr>
                        <ul class="media-list" v-for="(comment, index) in comments" :key="index">
                            <li class="media">
                                <a href="#" class="pull-left">
                                    <img v-bind:src="getProfileImage(comment.email)" alt="" class="img-circle">
                                </a>
                                <div class="media-body">
                                <span class="text-muted pull-right">
                                    <small class="text-muted">30 min ago</small>
                                </span>
                                    <strong class="text-success">@{{comment.email}}</strong>
                                    <p>
                                        {{comment.comment_text}}
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
        name: "CommentSection",
        props: {
            comments: Array
        },
        data() {
            return {
                newComment: '',
            }
        },
        methods: {
            postComment() {
                this.$emit("post:comment", this.newComment)
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