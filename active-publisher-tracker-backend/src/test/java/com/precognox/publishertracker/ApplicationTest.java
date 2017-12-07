package com.precognox.publishertracker;

import com.mashape.unirest.http.HttpResponse;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class ApplicationTest extends DropwizardTestSkeleton {

    @Test
    public void testApp() throws Exception {
        HttpResponse<String> resp = get("/public/echo");

        assertEquals(200, resp.getStatus());
        assertFalse(resp.getBody().isEmpty());
    }

}
