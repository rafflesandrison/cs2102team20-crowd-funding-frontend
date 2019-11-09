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

      <div class="row bootstrap snippets container main">
            <div class="col-md-8 col-md-offset-2 col-sm-12">
            <div class="comment-wrapper">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        Comment panel
                    </div>
                    <div class="panel-body">
                        <div class="clearfix"></div>
                        <hr>
                        <ul class="media-list" v-for="(update, index) in updates" :key="index">
                            <li class="media">
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
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "UpdateSection",
  props: {
    updates: Array
  }
};
</script>

<style scoped>
</style>