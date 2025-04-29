#home_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer  
from rest_framework import status


class HomePageAPI(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            "endpoints": [
                "/api/home/all-books/",
                "/api/home/new-arrivals/",
                "/api/home/best-sellers/",
                "/api/home/popular-authors/",
                "/api/home/top-publishers/",
                "/api/home/recommendations/",
                "/api/filter/",
            ]
        })

      
class AllBooksAPI(APIView):
    def get(self, request, *args, **kwargs):
        all_books = Product.objects.all()  
        serializer = ProductSerializer(all_books, many=True)
        return Response({"all_books": serializer.data}, status=status.HTTP_200_OK)
 
  
class NewArrivalsAPI(APIView):
    def get(self, request, *args, **kwargs):
        new_arrivals = Product.objects.all().order_by('-created_at')[:10]
        serializer = ProductSerializer(new_arrivals, many=True)

        return Response({"new_arrivals": serializer.data}, status=status.HTTP_200_OK)


class BestSellersAPI(APIView):
    def get(self, request, *args, **kwargs):
        best_sellers = Product.objects.all().order_by('?')[:5]
        serializer = ProductSerializer(best_sellers, many=True)

        return Response({"best_sellers": serializer.data}, status=status.HTTP_200_OK)


class BooksYouMightLikeAPI(APIView):
    def get(self, request, *args, **kwargs):
        random_books = Product.objects.all().order_by('?')[:5]
        serializer = ProductSerializer(random_books, many=True)

        return Response({"books_you_might_like": serializer.data}, status=status.HTTP_200_OK)


class PopularAuthorsAPI(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Popular Authors API."})


class TopPublishersAPI(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Top Publishers API."})



# Book Filtering
class FilteredBooksAPI(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Product.objects.all()

        # Retrieve query parameters
        genre = request.GET.get('genre', '').strip()
        author = request.GET.get('author', '').strip()
        publisher = request.GET.get('publisher', '').strip()
        sort_by = request.GET.get('sort_by', 'recent').strip()
        pages = request.GET.get('pages', '').strip()  

        # Apply filters on query parameters.
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if author:
            queryset = queryset.filter(author_name__icontains=author)
        if publisher:
            queryset = queryset.filter(publisher__icontains=publisher)
      
        if pages:
            try:
                pages = int(pages)
                queryset = queryset.filter(pages=pages)
            except ValueError:
                return Response({"message": "Invalid pages filter format. Use 'pages=X'."},
                                status=status.HTTP_400_BAD_REQUEST)

        # Sorting options.
        if sort_by == 'recent':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'oldest':
             queryset = queryset.order_by('created_at')
        elif sort_by == 'price_low_high':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_high_low':
            queryset = queryset.order_by('-price')
        elif sort_by == 'pages_low_high':  
            queryset = queryset.order_by('pages')
        elif sort_by == 'pages_high_low':  
            queryset = queryset.order_by('-pages')
        else:
            queryset = queryset.order_by('-created_at')  # Fallback sorting.

        if not queryset.exists():
            return Response({"message": "No books found matching the criteria."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(queryset, many=True)
        return Response({"filtered_books": serializer.data}, status=status.HTTP_200_OK)



class BookMetaInfoAPI(APIView):
    def get(self, request, *args, **kwargs):
        info_type = request.GET.get('type', None)

        genres = Product.objects.values_list('genre', flat=True).distinct()
        authors = Product.objects.values_list('author_name', flat=True).distinct()
        publishers = Product.objects.values_list('publisher', flat=True).distinct()

        data = {
            "genres": genres,
            "authors": authors,
            "publishers": publishers
        }

        if info_type:
            if info_type not in data:
                return Response({"message": "Invalid type parameter. Use 'genres', 'authors', or 'publishers'."},
                                status=status.HTTP_400_BAD_REQUEST)
            return Response({info_type: data[info_type]}, status=status.HTTP_200_OK)

        return Response(data, status=status.HTTP_200_OK)
    
    
    
