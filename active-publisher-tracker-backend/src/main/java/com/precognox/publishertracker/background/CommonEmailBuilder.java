package com.precognox.publishertracker.background;

import org.apache.commons.io.IOUtils;
import org.apache.velocity.Template;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class CommonEmailBuilder {

    private final VelocityEngine velocityEngine;

    private static final String TEMPLATE_LOADER_CLASS =
            "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader";

    public CommonEmailBuilder() {
        velocityEngine = new VelocityEngine();

        Properties velocityProps = new Properties();
        velocityProps.put("resource.loader", "classpath");
        velocityProps.put("classpath.resource.loader.class", TEMPLATE_LOADER_CLASS);

        velocityEngine.init(velocityProps);
    }

    protected String resolveTemplate(String templatePath, Context templateVariables) {
        Template template = velocityEngine.getTemplate(templatePath, StandardCharsets.UTF_8.name());
        StringWriter writer = new StringWriter();
        template.merge(templateVariables, writer);

        return writer.toString();
    }

    protected String readSubject(String resourceFilePath) {
        try {
            return IOUtils.resourceToString(resourceFilePath, Charset.forName("UTF-8"));
        } catch (IOException ex) {
            throw new IllegalStateException("Error while reading resource file: " + resourceFilePath, ex);
        }
    }

}
