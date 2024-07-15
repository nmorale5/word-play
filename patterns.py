from abc import ABC, abstractmethod

class Pattern(ABC):
    @abstractmethod
    def __str__(self):
        pass

    def __hash__(self):
        return hash(str(self))
    
    def __eq__(self, other):
        return str(self) == str(other)

# pattern must be on the left side of the word (wo...)
class LeftPattern(Pattern):
    def __init__(self, letters: str):
        self.letters = letters

    def __str__(self):
        return self.letters + "..."

# pattern must be on the right side of the word (...rds)
class RightPattern(Pattern):
    def __init__(self, letters: str):
        self.letters = letters

    def __str__(self):
        return "..." + self.letters
    
# pattern must be in the middle of the word (...or...)
class MiddlePattern(Pattern):
    def __init__(self, letters: str):
        self.letters = letters

    def __str__(self):
        return "..." + self.letters + "..."

# pattern must match first and last letters of word (wo...s)
class ExactMultiPattern(Pattern):
    def __init__(self, front_letters: str, back_letters: str):
        self.front_letters = front_letters
        self.back_letters = back_letters

    def __str__(self):
        return self.front_letters + "..." + self.back_letters
    
# pattern must match start of word and some middle string (w...rd...)
class LeftMultiPattern(Pattern):
    def __init__(self, front_letters: str, back_letters: str):
        self.front_letters = front_letters
        self.back_letters = back_letters

    def __str__(self):
        return self.front_letters + "..." + self.back_letters + "..."
    
# pattern must match end of word and some middle string (...o...s)
class RightMultiPattern(Pattern):
    def __init__(self, front_letters: str, back_letters: str):
        self.front_letters = front_letters
        self.back_letters = back_letters

    def __str__(self):
        return "..." + self.front_letters + "..." + self.back_letters
    
# pattern must match two separate strings in middle of word (...o...d...)
class MiddleMultiPattern(Pattern):
    def __init__(self, front_letters: str, back_letters: str):
        self.front_letters = front_letters
        self.back_letters = back_letters

    def __str__(self):
        return "..." + self.front_letters + "..." + self.back_letters + "..."
