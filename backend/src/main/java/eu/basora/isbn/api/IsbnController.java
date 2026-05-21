package eu.basora.isbn.api;

import eu.basora.isbn.application.IsbnLookupResult;
import eu.basora.isbn.application.IsbnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/isbn")
@RequiredArgsConstructor
@Tag(name = "ISBN", description = "Look up editions by ISBN")
public class IsbnController {

    private final IsbnService isbnService;

    @GetMapping("/{isbn}")
    @Operation(summary = "Look up a work by ISBN-10 or ISBN-13")
    public IsbnLookupResult lookup(@PathVariable String isbn) {
        return isbnService.lookup(isbn);
    }
}
