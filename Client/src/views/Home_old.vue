<template>
  <div class="d-flex bg-light">
    <SidebarMenu />

    <div class="flex-grow-1 p-4">
      <div class="d-flex justify-content-between mb-4">
        <h2 class="fw-bold">Kindle.</h2>
        <input type="text" class="form-control w-25" placeholder="Search your books" />
      </div>

      <!-- Books you read last -->
      <h5 class="fw-bold mb-3">Books you read last</h5>
      <div class="d-flex gap-3 mb-4">
        <BookLargeCard
          v-for="(book, index) in recentBooks"
          :key="index"
          v-bind="book"
        />
      </div>

      <!-- New Release -->
      <h5 class="fw-bold mb-3">New Release</h5>
      <div class="d-flex gap-4 flex-wrap mb-5">
        <BookCard
          v-for="(book, index) in newRelease"
          :key="index"
          v-bind="book"
        />
      </div>

      <!-- Famous Authors -->
      <h5 class="fw-bold mb-3">Famous Authors</h5>
      <AuthorCard
        v-for="(author, index) in authors"
        :key="index"
        v-bind="author"
      />
    </div>
  </div>
</template>

<script>
import SidebarMenu from "@/components/SidebarMenu.vue";
import BookCard from "@/components/BookCard.vue";
import BookLargeCard from "@/components/BookLargeCard.vue";
import AuthorCard from "@/components/AuthorCard.vue";

export default {
  components: {
    SidebarMenu,
    BookCard,
    BookLargeCard,
    AuthorCard,
  },

  data() {
    return {
      recentBooks: [
        {
          image: "https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg",
          title: "Harry Potter And The Sorcerer’s Stone",
          subtitle: "193 Pages · Chapter 13",
          status: "Last Read",
        },
        {
          image: "https://m.media-amazon.com/images/I/91Uw5UMLuIL.jpg",
          title: "The Water Dancer",
          subtitle: "New Purchase",
          status: "Yet to Read",
        }
      ],
      newRelease: [
        {
          image: "https://m.media-amazon.com/images/I/81r7fYqKTRL.jpg",
          title: "The Glass Hotel",
          author: "Emily St. John",
          category: "Fiction"
        },
        {
          image: "https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg",
          title: "The Book of Longings",
          author: "Sue Monk Kidd",
          category: "History"
        }
      ],
      authors: [
        {
          image: "https://i.pravatar.cc/100?img=3",
          name: "J.K Rowling",
          books: 19
        },
        {
          image: "https://i.pravatar.cc/100?img=13",
          name: "Stephen King",
          books: 60
        }
      ]
    };
  }
};
</script>

<style scoped>
.home-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  padding-left: 40px;
  border-radius: 25px;
  border: 1px solid #ddd;
}

.search-box input:focus {
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  border-color: #667eea;
}

.badge {
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.badge:hover {
  background-color: #667eea !important;
  color: white !important;
  transform: translateY(-2px);
}
</style>