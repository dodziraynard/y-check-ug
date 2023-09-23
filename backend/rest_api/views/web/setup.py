from rest_framework import generics, permissions, status


class SetupIndexAPI(generics.GenericAPIView):
    """
    Get the profile info of an adolescent.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pid, *args, **kwargs):
        pass
