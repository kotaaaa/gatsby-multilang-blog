---
title: Vue.js vs Angular
date: '2020-08-31 18:46:37'
description: Vue, Angular
category: Frontend
background: '#9400d3'
---

# Table of Contents

-   Share & trend of both flamework
-   Comparison
    -   basic function
    -   Data store
    -   Routing
-   Summary

# Comparison

|                 | Vue.js                                                                                                                                         | Angular.js                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Language        | javascript                                                                                                                                     | typescript                                                                                                                                |
| Data binding    | Basically, Unidirectional (Data ==> View) But Bi-directional is also supported with v-model (Data <==> View)                                   | Bi-directional (Data <==> View)                                                                                                           |
| Routing         | vue-router (external library)                                                                                                                  | @augular/router (Angular default)                                                                                                         |
| Data store      | We need another library called vuex                                                                                                            | Small-scale development: service is sufficient. Large-scale development: You will need a different architecture such as Flux, Redux, etc. |
| Skills to learn | Understanding unidirectional data flow, the roles of action, state, and mutation, the relationship between vue libraries (e.g., vuex) and vue. | Roles of component, service typescript                                                                                                    |
| Learning cost   | Low (libraries can be added as the service expands)                                                                                            | High (you have to learn angular all over again)                                                                                           |

![vue_state](/assets/img/vue-vs-angular/vue_state.png)

![angular](/assets/img/vue-vs-angular/angular.png)

|                              | Vue.js                                                                              | Angular                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Personal impressions         | The grammar is vague, and there is a lot of frexibility                             | Compared to vue, the overall writing style is strictly defined, so each developer can write the code in a consistent manner. |
| What kind of people like it. | People who want to have a high degree of frexibility and move quickly will like it. | People who want to write tightly will like it.                                                                               |

###### component.vue

```html
<template>
    <div id="product-list-two">
        <h2>Movie List</h2>
        <h2>{{ $store.state.movie_list }}</h2>
        <ul>
            <li v-for="movie in $store.state.movie_list" :key="movie.id">
                <span class="name">{{ movie.original_title }}</span>
                <tr>
                    <td>
                        <img
                            :src="
                'https://image.tmdb.org/t/p/w300_and_h450_bestv2' +
                movie.poster_path
              "
                            align="top"
                        />
                    </td>
                    <td>
                        <span class="content_title"> Genre: </span>
                        <span v-for="cat in movie.genre_ids" :key="cat.id">
                            <span class="each_genre">
                                {{ getGenreById(cat)[0].name }},
                            </span>
                        </span>
                        <br />
                        <span class="content_title">Overview:</span>
                        <span class="overview">
                            {{ movie.overview }}
                        </span>
                    </td>
                </tr>
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapState, mapGetters } from 'vuex'
    export default {
        created() {
            this.$store.dispatch('set_movie_list')
        },
        computed: {
            saleMovies() {
                return this.$store.getters.saleMovies
            },
            getGenreById() {
                return this.$store.getters.getGenreById
            },
            shoeEl() {
                console.log(this.$el)
            },
        },
    }
</script>
```

###### store.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import movieApi from '../api/movie'
import babelPolyfill from 'babel-polyfill'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,
    state: {
        movie_list: [],
        genres: [{ id: 1, name: 'Action' }],
    },
    getters: {
        getGenreById: state => id => {
            return state.genres.filter(genre => genre.id === id)
        },
    },
    mutations: {
        setMovie(state, list) {
            state.movie_list = list
        },
    },
    actions: {
        async set_movie_list(context) {
            let list = await movieApi.fetchLists()
            context.commit('setMovie', list.results)
        },
    },
})
```

# Summary

-   Difference between Vue.js and Angular

    -   Data flow
    -   Strictness of writing code
    -   External libraries(data store, routing)

-   What we have to care when we decide one of them…
    -   the ecosystem (including whether there are many developers who use it or not) may be the key to success. (easier to resolve errors)
    -   Popularness in order to hire good engineers.
